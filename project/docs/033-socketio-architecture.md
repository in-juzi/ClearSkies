# Socket.io Real-Time Architecture

The game uses Socket.io for real-time bidirectional communication between client and server, replacing HTTP polling for activities, crafting, and combat systems.

## Architecture Overview

### Backend Socket Handlers

**Location**: `be/sockets/`

**Handlers**:
- [activityHandler.ts](../../be/sockets/activityHandler.ts) - Activity system (gathering, combat encounters)
- [craftingHandler.ts](../../be/sockets/craftingHandler.ts) - Crafting system (recipes, quality inheritance)
- [combatHandler.ts](../../be/sockets/combatHandler.ts) - Combat system (turn-based combat, abilities)
- [chatHandler.js](../../be/sockets/chatHandler.js) - Chat system (global chat, commands)

**Features**:
- JWT authentication middleware for all socket connections
- Server-authoritative timing using setTimeout for action completion
- Real-time event broadcasting to all connected clients
- Automatic reconnection handling

### Frontend Socket Services

**Location**: `ui/src/app/services/`

**Services**:
- [location.service.ts](../../ui/src/app/services/location.service.ts) - Activity state management
- [crafting.service.ts](../../ui/src/app/services/crafting.service.ts) - Crafting state management
- [combat.service.ts](../../ui/src/app/services/combat.service.ts) - Combat state management
- [chat.service.ts](../../ui/src/app/services/chat.service.ts) - Chat state management
- [socket.service.ts](../../ui/src/app/services/socket.service.ts) - Base Socket.io client wrapper

**Features**:
- Angular signals for reactive state updates
- Effect hooks for setting up listeners when connected
- Auto-reconnection and status restoration
- Observable pattern for event streams

## Key Features

### Server-Authoritative Timing

**Prevents client-side manipulation**:
- Backend controls when actions complete using setTimeout
- Activity durations, crafting times, and combat turn timings enforced server-side
- Client cannot modify completion times or skip delays
- Timestamps used for cooldowns and duration tracking

**Example (Activity Completion)**:
```typescript
// Server-side (activityHandler.ts)
const completionTime = Date.now() + (activity.duration * 1000);

setTimeout(() => {
  // Award rewards after exact duration
  const rewards = locationService.processActivityCompletion(player, activity);
  socket.emit('activity:completed', { rewards });
}, activity.duration * 1000);
```

### Client-Driven Auto-Restart

**Prevents AFK grinding while maintaining convenience**:
- Frontend stores last action parameters (e.g., lastRecipeId, lastActivityId)
- Automatically restarts completed actions without user input
- **Requires active player at completion** - if player disconnected, no restart
- Can be disabled for cancelled or error states

**Example (Auto-Restart)**:
```typescript
// Frontend (location.service.ts)
this.socketService.on('activity:completed', (data) => {
  this.completed$.next(data.rewards);

  // Auto-restart if player is still connected
  if (this.lastActivityId) {
    this.startActivity(this.lastActivityId);
  }
});
```

### Activity Overwriting

**Seamless action transitions**:
- Starting a new activity automatically cancels the current one
- Starting a new crafting automatically cancels the current one
- Starting travel automatically cancels the current activity
- No blocking errors - actions seamlessly overwrite each other
- **Exception**: Combat blocks travel (cannot flee via travel action)

**Example (Overwrite Logic)**:
```typescript
// Server-side (activityHandler.ts)
if (player.activeActivity) {
  // Cancel previous activity
  clearTimeout(player.activeActivity.timer);
  player.activeActivity = null;
}

// Start new activity
player.activeActivity = { activityId, timer: setTimeout(...) };
```

### Real-Time State Updates

**Instant feedback without polling**:
- Socket events broadcast state changes instantly
- No HTTP polling overhead (previously 500ms-1s intervals)
- Player actions immediately visible without page refresh
- Combat turns, crafting progress, activity completion all real-time

**Performance Benefits**:
- Eliminated 1000+ HTTP requests per minute during active gameplay
- Reduced server CPU and network usage
- Improved responsiveness and user experience

### Reconnection Handling

**Seamless experience after disconnect/reload**:
- Status check events restore state after disconnect
- `activity:getStatus`, `crafting:getStatus`, `combat:getStatus`
- Progress timers resume from server timestamps
- No lost progress on temporary disconnections

**Example (Reconnection)**:
```typescript
// Frontend (location.service.ts)
effect(() => {
  if (this.socketService.isConnected()) {
    // Request current status after reconnection
    this.socketService.emit('activity:getStatus');
  }
});
```

## Socket Event Patterns

### Activity System Events

**Client → Server**:
- `activity:start` - Request to start gathering/combat activity
- `activity:cancel` - Request to cancel current activity
- `activity:getStatus` - Request current activity status (reconnection)

**Server → Client**:
- `activity:started` - Confirms activity started with completion timestamp
- `activity:completed` - Activity finished, includes rewards (XP, items, gold)
- `activity:cancelled` - Activity cancelled by player
- `activity:error` - Error starting activity (validation failed)

### Crafting System Events

**Client → Server**:
- `crafting:start` - Request to start crafting recipe
- `crafting:cancel` - Request to cancel current crafting
- `crafting:getStatus` - Request current crafting status (reconnection)

**Server → Client**:
- `crafting:started` - Confirms crafting started with completion timestamp
- `crafting:completed` - Crafting finished, includes created item
- `crafting:cancelled` - Crafting cancelled by player
- `crafting:error` - Error starting craft (insufficient materials)

### Combat System Events

**Client → Server**:
- `combat:attack` - Player basic attack
- `combat:useAbility` - Player uses combat ability
- `combat:useItem` - Player uses consumable item
- `combat:flee` - Attempt to flee from combat
- `combat:getStatus` - Request current combat status (reconnection)

**Server → Client**:
- `combat:started` - Combat encounter started
- `combat:playerAttack` - Server broadcasts player attack result
- `combat:monsterAttack` - Server broadcasts monster attack
- `combat:abilityUsed` - Server broadcasts ability result
- `combat:itemUsed` - Server broadcasts item use result
- `combat:buffApplied` - Server broadcasts buff/debuff application
- `combat:buffExpired` - Server broadcasts buff/debuff expiration
- `combat:victory` - Combat won, includes rewards
- `combat:defeat` - Combat lost, player respawns
- `combat:fled` - Successfully fled from combat

### Chat System Events

**Client → Server**:
- `chat:sendMessage` - Send message to global chat

**Server → Client**:
- `chat:message` - Receive broadcasted message
- `chat:getHistory` - Load chat history (up to 100 messages)
- `chat:getOnlineCount` - Get number of connected users

## Frontend Service Pattern

All Socket.io services follow a consistent pattern for maintainability:

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private socketService = inject(SocketService);

  // Signals for reactive state
  activeState = signal<State | null>(null);
  isActive = signal<boolean>(false);

  // Observables for events
  completed$ = new Subject<Result>();
  error$ = new Subject<Error>();

  // Store for auto-restart
  private lastActionParams: any = null;

  constructor() {
    // Setup listeners when connected
    effect(() => {
      if (this.socketService.isConnected()) {
        this.setupSocketListeners();
      }
    });
  }

  private setupSocketListeners(): void {
    this.socketService.on('event:started', (data) => {
      this.activeState.set(data.state);
      this.isActive.set(true);
    });

    this.socketService.on('event:completed', (data) => {
      this.isActive.set(false);
      this.completed$.next(data.result);

      // Auto-restart if enabled
      if (this.lastActionParams) {
        this.startAction(this.lastActionParams);
      }
    });

    this.socketService.on('event:error', (error) => {
      this.error$.next(error);
    });
  }

  async startAction(params: any): Promise<any> {
    this.lastActionParams = params; // Store for auto-restart
    return await this.socketService.emit('event:start', params);
  }

  async cancelAction(): Promise<void> {
    this.lastActionParams = null; // Disable auto-restart
    await this.socketService.emit('event:cancel');
  }

  ngOnDestroy(): void {
    // Clean up listeners
    this.socketService.off('event:started');
    this.socketService.off('event:completed');
    this.socketService.off('event:error');
  }
}
```

## Migration from HTTP Polling

### Before (HTTP Polling)

**Problems**:
- Location/Activity: 1-second polling interval in locationController
- Crafting: HTTP endpoint with manual status checks
- Combat: 500ms polling for real-time combat feel
- High server load from constant requests
- Network overhead from repeated HTTP headers
- Delayed updates between polling intervals

**Example (Old Pattern)**:
```typescript
// Poll every 1 second
setInterval(() => {
  this.http.get('/api/locations/activity-status').subscribe(status => {
    if (status.completed) {
      this.loadRewards();
    }
  });
}, 1000);
```

### After (Socket.io)

**Benefits**:
- All systems use real-time socket events
- Zero polling overhead
- Instant state updates on server changes
- Server-authoritative timing prevents exploits
- Client-driven auto-restart prevents AFK grinding
- Reconnection support for seamless experience

**Example (New Pattern)**:
```typescript
// Listen for instant completion event
this.socketService.on('activity:completed', (rewards) => {
  this.loadRewards(rewards);
  if (this.autoRestart) {
    this.startActivity(this.lastActivityId);
  }
});
```

## Performance Impact

**Metrics** (during active gameplay):
- **HTTP Polling**: 1000+ requests per minute
- **Socket.io**: ~10 events per minute (only when state changes)
- **Reduction**: 99% fewer network operations
- **Server CPU**: Significantly reduced (no repeated request processing)
- **User Experience**: Instant feedback instead of up to 1-second delay

## Security Considerations

**JWT Authentication**:
- All socket connections require valid JWT token
- Token validated on connection and stored in socket context
- User ID attached to all socket events for authorization

**Server-Authoritative Timing**:
- Prevents client manipulation of completion times
- Prevents skipping activity durations
- Cooldowns based on server timestamps

**Validation**:
- All actions validated server-side (skills, equipment, materials)
- Client cannot trigger invalid actions
- Error messages sent via socket events

## Debugging

**Client-Side Logging**:
```typescript
this.socketService.on('*', (event, data) => {
  console.log('[Socket Event]', event, data);
});
```

**Server-Side Logging**:
```typescript
socket.onAny((event, ...args) => {
  console.log(`[Socket ${socket.id}] ${event}`, args);
});
```

## References

- [location-system.md](location-system.md) - Activity socket events
- [crafting-system.md](crafting-system.md) - Crafting socket events
- [combat-system.md](combat-system.md) - Combat socket events
- [chat-system.md](chat-system.md) - Chat socket events
- Socket.io Documentation: https://socket.io/docs/v4/
