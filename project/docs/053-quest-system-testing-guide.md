# Quest System Testing Guide

**Document Status**: Active Testing Phase
**Created**: 2025-11-16
**Last Updated**: 2025-11-16

## Overview

Comprehensive testing guide for the quest system implementation, covering all features from auto-accept tutorial quests to quest journal UI and real-time updates.

---

## System Components

### Backend
- **Quest Service**: [be/services/questService.ts](../../be/services/questService.ts)
- **Quest Socket Handler**: [be/sockets/questHandler.ts](../../be/sockets/questHandler.ts)
- **Quest Controller**: [be/controllers/questController.ts](../../be/controllers/questController.ts)
- **Quest Routes**: [be/routes/quests.ts](../../be/routes/quests.ts)
- **Quest Registry**: [be/data/quests/QuestRegistry.ts](../../be/data/quests/QuestRegistry.ts)

### Frontend
- **Quest Service**: [ui/src/app/services/quest.service.ts](../../ui/src/app/services/quest.service.ts)
- **Quest Journal**: [ui/src/app/components/game/quest-journal/quest-journal.ts](../../ui/src/app/components/game/quest-journal/quest-journal.ts)
- **Quest Tracker**: [ui/src/app/components/game/quest-tracker/quest-tracker.ts](../../ui/src/app/components/game/quest-tracker/quest-tracker.ts)
- **Notification Service**: [ui/src/app/services/notification.service.ts](../../ui/src/app/services/notification.service.ts)
- **World Map Integration**: [ui/src/app/components/game/world-map/world-map.ts](../../ui/src/app/components/game/world-map/world-map.ts)

---

## Quest Catalog

### Tutorial Quests (5 total)
All tutorial quests have `autoAccept: true` and unlock in sequence.

1. **Welcome to Kennik** (`tutorial_welcome`)
   - Auto-accepts on player creation
   - Objective: Visit Fishing Dock
   - Rewards: 50 gold
   - Unlocks: First Catch

2. **First Catch** (`tutorial_first_catch`)
   - Objective: Catch 3 cod
   - Rewards: 100 gold
   - Unlocks: Herb Gathering 101

3. **Herb Gathering 101** (`tutorial_herb_gathering`)
   - Objective: Gather 5 chamomile
   - Rewards: 100 gold
   - Unlocks: Healing Hands

4. **Healing Hands** (`tutorial_healing_hands`)
   - Objective: Craft 2 lesser healing potions
   - Rewards: 150 gold
   - Unlocks: Into the Woods

5. **Into the Woods** (`tutorial_into_the_woods`)
   - Objective: Chop 5 oak logs
   - Rewards: 200 gold
   - Completion: Tutorial chain complete

### Optional Quests (7 total)
Available after tutorial completion.

1. **Sharpening Your Skills** (`optional_sharpening_skills`)
   - Objective: Reach level 5 in any skill
   - Rewards: 250 gold

2. **Alchemist's Apprentice** (`optional_alchemist_apprentice`)
   - Objective: Craft 5 any potions
   - Rewards: 300 gold

3. **Ore You Ready** (`optional_ore_you_ready`)
   - Objective: Mine 10 any ore
   - Rewards: 200 gold

4. **First Blood** (`optional_first_blood`)
   - Objective: Defeat 3 any monsters
   - Rewards: 500 gold

5. **Tool Time** (`optional_tool_time`)
   - Objective: Equip any tool
   - Rewards: 100 gold

6. **Culinary Basics** (`optional_culinary_basics`)
   - Objective: Cook 3 any meals
   - Rewards: 200 gold

7. **Fully Equipped** (`optional_fully_equipped`)
   - Objective: Equip items in 5 slots
   - Rewards: 400 gold

---

## Test Plan

### Phase 1: Auto-Accept & Tutorial Chain

#### Test 1.1: New Player Auto-Accept
**Setup**: Create a new player account
**Steps**:
1. Complete registration and login
2. Open quest journal immediately
3. Check active quests tab

**Expected Results**:
- ✅ "Welcome to Kennik" appears in active quests
- ✅ Quest notification appears on screen
- ✅ Quest tracker shows in right sidebar
- ✅ No manual accept needed

**Verification Points**:
- Quest status: Active
- Objectives: 0/1 complete
- Auto-accept timestamp recorded

---

#### Test 1.2: Quest Chain Progression
**Setup**: Complete "Welcome to Kennik"
**Steps**:
1. Travel to Fishing Dock facility
2. Wait for objective completion
3. Complete quest for rewards
4. Check available quests

**Expected Results**:
- ✅ "First Catch" unlocks automatically
- ✅ "First Catch" appears in available quests
- ✅ Quest notification for unlock
- ✅ Previous quest moves to completed tab

**Verification Points**:
- Rewards granted (50 gold)
- Quest completion timestamp
- Next quest in chain available

---

### Phase 2: Objective Tracking

#### Test 2.1: Activity Completion Objectives
**Setup**: Accept "First Catch" quest
**Steps**:
1. Start fishing activity at dock
2. Complete 1 fishing action
3. Check quest progress
4. Complete 2 more fishing actions
5. Verify quest completion

**Expected Results**:
- ✅ Progress updates after each completion (1/3, 2/3, 3/3)
- ✅ Quest tracker updates in real-time
- ✅ Notification on progress milestones
- ✅ "Complete" button enabled at 3/3

**Verification Points**:
- Socket events: `quest:update` received
- Objective current count increments
- UI updates without refresh

---

#### Test 2.2: Crafting Objectives
**Setup**: Accept "Healing Hands" quest
**Steps**:
1. Gather chamomile herbs
2. Craft 1 lesser healing potion
3. Check quest progress
4. Craft 1 more potion
5. Complete quest

**Expected Results**:
- ✅ Progress: 1/2, then 2/2
- ✅ Real-time UI update
- ✅ Quest completion notification

**Verification Points**:
- Crafting triggers objective update
- Trait/quality doesn't affect count
- Only correct potion type counts

---

#### Test 2.3: Equipment Objectives
**Setup**: Accept "Tool Time" quest
**Steps**:
1. Equip bronze woodcutting axe
2. Check quest progress
3. Complete quest

**Expected Results**:
- ✅ Immediate completion on equip
- ✅ Quest marked complete
- ✅ Notification appears

**Verification Points**:
- Equipment change triggers check
- Any tool subtype counts
- Unequipping doesn't revert progress

---

### Phase 3: Quest Rewards

#### Test 3.1: Gold Rewards
**Setup**: Complete "Welcome to Kennik"
**Steps**:
1. Note current gold amount
2. Complete quest
3. Check gold balance

**Expected Results**:
- ✅ Gold +50
- ✅ Notification shows reward
- ✅ Player gold updates immediately

**Verification Points**:
- Exact reward amount granted
- No duplicate rewards on refresh
- Gold balance persists

---

#### Test 3.2: Quest Unlock Rewards
**Setup**: Complete tutorial quest
**Steps**:
1. Complete "Welcome to Kennik"
2. Check available quests tab
3. Verify "First Catch" appears

**Expected Results**:
- ✅ Next quest unlocks
- ✅ Appears in available quests
- ✅ Can be accepted immediately

**Verification Points**:
- Unlock recorded in player data
- Quest requirements met
- No errors on unlock

---

### Phase 4: Quest Journal UI

#### Test 4.1: Three-Tab Interface
**Setup**: Have quests in all states
**Steps**:
1. Accept at least 1 quest
2. Complete at least 1 quest
3. Open quest journal
4. Click each tab (Available, Active, Completed)

**Expected Results**:
- ✅ Available tab shows acceptable quests
- ✅ Active tab shows in-progress quests
- ✅ Completed tab shows finished quests
- ✅ Tab switching works smoothly
- ✅ Quest counts correct in each tab

**Verification Points**:
- No quests appear in wrong tab
- Progress bars show correctly
- Gold quest styling applied

---

#### Test 4.2: Quest Details Display
**Setup**: Open any active quest
**Steps**:
1. Open quest journal
2. View active quest details
3. Check all information

**Expected Results**:
- ✅ Quest name displayed
- ✅ Description shown
- ✅ Objectives listed with progress
- ✅ Rewards displayed
- ✅ Action buttons present (Abandon, Complete)

**Verification Points**:
- Progress bars animate correctly
- Checkmarks on completed objectives
- Complete button disabled until ready

---

#### Test 4.3: Real-Time Updates
**Setup**: Quest journal open during gameplay
**Steps**:
1. Open quest journal
2. Complete an objective without closing journal
3. Watch for updates

**Expected Results**:
- ✅ Progress updates automatically
- ✅ No manual refresh needed
- ✅ Smooth animations on update

**Verification Points**:
- Socket event triggers UI update
- Observable updates propagate
- No UI flickering

---

### Phase 5: World Map Integration

#### Test 5.1: Quest Waypoint Markers
**Setup**: Accept quest with location objective
**Steps**:
1. Accept "Into the Woods" quest
2. Open world map
3. Look for waypoint markers

**Expected Results**:
- ✅ Gold waypoint marker at Forest Clearing
- ✅ Marker pulses/glows
- ✅ Clicking marker shows location details
- ✅ Marker disappears when objective complete

**Verification Points**:
- Marker color: #ffd700 (gold)
- Pulse animation active
- Only shows for active quest locations

---

#### Test 5.2: Multiple Quest Markers
**Setup**: Accept multiple quests with different locations
**Steps**:
1. Accept 3+ quests with different locations
2. Open world map
3. Verify all markers present

**Expected Results**:
- ✅ Multiple waypoints visible
- ✅ Each links to correct location
- ✅ No marker overlap issues

**Verification Points**:
- All active quest locations marked
- Markers distinguishable
- Map performance acceptable

---

### Phase 6: NPC Quest Indicators

#### Test 6.1: Quest Giver Indicators
**Setup**: Have available quest from vendor
**Steps**:
1. Travel to location with quest giver
2. View facility vendor list
3. Check for indicators

**Expected Results**:
- ✅ Gold exclamation mark on vendor card
- ✅ Card border highlighted
- ✅ Indicator pulses
- ✅ Clicking opens vendor

**Verification Points**:
- Indicator color: #ffd700
- Pulse animation: 2s infinite
- Only on vendors with quests

---

#### Test 6.2: Quest Complete Indicators
**Setup**: Complete quest, return to giver
**Steps**:
1. Complete all quest objectives
2. Return to quest giver location
3. Check indicator

**Expected Results**:
- ✅ Different indicator (e.g., gold question mark)
- ✅ Or same indicator style
- ✅ Clear visual cue

**Verification Points**:
- Indicator changes on completion
- Quest can be turned in
- Indicator disappears after turn-in

---

### Phase 7: Notifications

#### Test 7.1: Quest Accept Notification
**Setup**: Accept any quest
**Steps**:
1. Open available quests
2. Click "Accept" on a quest
3. Watch for notification

**Expected Results**:
- ✅ Notification appears (top-right)
- ✅ Gold styling
- ✅ Shows quest name
- ✅ Auto-dismisses after 5s

**Verification Points**:
- Notification text clear
- Styling matches quest theme
- No duplicate notifications

---

#### Test 7.2: Progress Notifications
**Setup**: Active quest with tracking
**Steps**:
1. Complete an objective increment
2. Watch for notification

**Expected Results**:
- ✅ "Quest Progress" notification
- ✅ Shows current/total (e.g., "2/5")
- ✅ Auto-dismisses

**Verification Points**:
- Shows after each completion
- Accurate count
- Not too spammy

---

#### Test 7.3: Quest Complete Notification
**Setup**: Quest with all objectives done
**Steps**:
1. Complete final objective
2. Watch for notification

**Expected Results**:
- ✅ "Quest Complete!" notification
- ✅ Special styling (larger, gold glow)
- ✅ Longer display (8s)
- ✅ Prompts return to quest giver

**Verification Points**:
- Distinct from progress updates
- Celebration feel
- Clear next action

---

#### Test 7.4: Reward Notification
**Setup**: Turn in completed quest
**Steps**:
1. Complete quest
2. Turn in at quest giver
3. Watch for reward notification

**Expected Results**:
- ✅ "Quest Rewarded!" notification
- ✅ Shows gold amount
- ✅ Shows XP if applicable
- ✅ Success styling

**Verification Points**:
- Lists all rewards
- Accurate amounts
- Player balances update

---

### Phase 8: Edge Cases & Error Handling

#### Test 8.1: Quest Abandonment
**Setup**: Active quest
**Steps**:
1. Open quest journal
2. Click "Abandon Quest"
3. Confirm abandonment

**Expected Results**:
- ✅ Quest removed from active
- ✅ Returns to available (if repeatable)
- ✅ Progress reset
- ✅ Warning notification

**Verification Points**:
- No reward granted
- Can re-accept
- Progress doesn't persist

---

#### Test 8.2: Socket Disconnection
**Setup**: Active quest, disconnect socket
**Steps**:
1. Start quest
2. Disconnect internet/kill socket
3. Complete objective
4. Reconnect

**Expected Results**:
- ✅ Progress queued or synced on reconnect
- ✅ No progress lost
- ✅ Error notification if needed

**Verification Points**:
- Graceful degradation
- Data integrity maintained
- User informed of issues

---

#### Test 8.3: Multiple Quests Same Objective
**Setup**: Two quests needing same activity
**Steps**:
1. Accept "First Catch" (3 cod)
2. Accept another fishing quest
3. Complete 1 fishing action
4. Check both quests

**Expected Results**:
- ✅ Both quests update
- ✅ Single action counts for both
- ✅ Progress tracked separately

**Verification Points**:
- No double-counting
- Independent progress
- Both completable

---

#### Test 8.4: Quest Prerequisites
**Setup**: Quest with requirements
**Steps**:
1. Try to accept quest without meeting requirements
2. Check error handling

**Expected Results**:
- ✅ Error notification
- ✅ Requirements displayed
- ✅ Quest grayed out/disabled

**Verification Points**:
- Clear error message
- Requirements listed
- No partial acceptance

---

## Performance Checks

### Load Testing
- [ ] 10+ active quests (UI performance)
- [ ] 50+ completed quests (journal scroll)
- [ ] Rapid objective completion (socket throughput)

### Memory Leaks
- [ ] Open/close journal 100x (no memory growth)
- [ ] Accept/abandon quests repeatedly (cleanup)
- [ ] Socket event handling (listener cleanup)

---

## Browser Compatibility

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Edge (latest)

### Mobile Responsive
- [ ] Quest journal on mobile
- [ ] Notifications readable
- [ ] Touch interactions work

---

## Data Integrity

### Database Checks
After completing test suite:

1. **Player Quest Progress**
   ```javascript
   // Check player document in MongoDB
   player.questProgress: {
     completed: ['tutorial_welcome', 'tutorial_first_catch', ...],
     active: [
       {
         questId: 'tutorial_herb_gathering',
         objectives: [{ objectiveId: '...', current: 3, required: 5 }],
         acceptedAt: <timestamp>,
         completedAt: null
       }
     ]
   }
   ```

2. **Quest State Consistency**
   - No quest in both active and completed
   - No negative progress values
   - Timestamps logical (acceptedAt < completedAt)

3. **Reward Application**
   - Gold balance matches expected
   - XP granted correctly
   - Item rewards in inventory

---

## Known Issues / Limitations

### Current Limitations
1. Quest objectives only support: VISIT, COMPLETE_ACTIVITY, CRAFT_ITEM, EQUIP_ITEM, DEFEAT_MONSTER
2. No quest item rewards yet (only gold/XP)
3. No quest chains with branching paths
4. No daily/weekly reset functionality
5. Quest dialogue not interactive (static text)

### Future Enhancements
- Quest item rewards
- Dialogue system with NPC interaction
- Quest achievement integration
- Repeatable quests with cooldowns
- Quest log filtering/search
- Quest sharing (party quests)

---

## Success Criteria

Quest system is ready for production if:

- ✅ All 12 quests completable end-to-end
- ✅ Auto-accept works for tutorial quests
- ✅ Quest chain unlocks in correct order
- ✅ All objective types track correctly
- ✅ Rewards granted accurately
- ✅ Quest journal UI functional and responsive
- ✅ Real-time updates work via Socket.io
- ✅ Quest waypoints display on map
- ✅ NPC indicators show correctly
- ✅ Notifications clear and timely
- ✅ No critical bugs or data loss
- ✅ Performance acceptable (< 100ms UI updates)

---

## Testing Checklist

Use this checklist to track testing progress:

### Core Functionality
- [ ] Tutorial quest auto-accept on new player
- [ ] Quest chain progression (all 5 tutorial quests)
- [ ] Activity completion objectives
- [ ] Crafting objectives
- [ ] Equipment objectives
- [ ] Combat objectives (when available)
- [ ] Gold rewards
- [ ] XP rewards (when implemented)
- [ ] Quest unlock rewards

### UI Components
- [ ] Quest journal three-tab interface
- [ ] Quest details display
- [ ] Real-time progress updates
- [ ] Quest tracker in sidebar
- [ ] Notification display
- [ ] World map waypoints
- [ ] NPC quest indicators

### Edge Cases
- [ ] Quest abandonment
- [ ] Socket disconnection recovery
- [ ] Multiple quests same objective
- [ ] Quest prerequisite checking
- [ ] Objective overflow (complete 10/5)

### Performance
- [ ] Multiple active quests (10+)
- [ ] Large completed quest list (50+)
- [ ] Rapid objective completion
- [ ] Memory leak checks

### Data Integrity
- [ ] Quest state consistency
- [ ] Reward application accuracy
- [ ] Progress persistence
- [ ] Timestamp validity

---

## Contact

For questions about this testing guide or to report bugs:
- Check [project/docs/](.) for related documentation
- Review [be/data/quests/QuestRegistry.ts](../../be/data/quests/QuestRegistry.ts) for quest definitions
- Examine Socket.io events in [be/sockets/questHandler.ts](../../be/sockets/questHandler.ts)

---

**End of Testing Guide**
