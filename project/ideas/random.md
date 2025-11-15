## Wakeup Slide

### When the user logs in or refreshes with a valid token, before being presented with the game screen, they would have a black screen that lists their last activity, location, combat, etc. This screen is like them waking up from a nap or sleep, and give the game time to get connected and set up before presenting the game screen.

## NPCs

### To tie in with the lore of the world, have npcs, controlled by the server, travel around. They could have specialties, and as they travel around, they will pop into their activities that they specialize in and give the player an assist.

## Local chat

### It would be cool to have a socket connection for each location, and maybe even facilities, at least the ones that make sense. We could display the facility/location player list, and allow players to chat in those sockets.

## Attributes
```
We currently have some systems that are static, rather than rewarding the player for progressing and getting stronger. These systems include:
HP
MP
Inventory capacity

My plan with attributes, which currently don't have a ton of use, was to have your attributes increase these properties as you level the attributes up. Also, I'd like to change the inventory capacity system to limit the player's capacity by weight rather than number of items. Later on, I'd like to implement player housing, which would then store an (upgradble) number of items. This would make sense because when you're out and about the world, you could probably carry around 100 flowers easily since they're light, but back home, you only have limited space for storage, and that space doesn't care about how heavy the items are.

So the scaling (for now) would work something like this:

A fresh character starts with a base 10 hp
They would get 4 extra hp per level of strength.
They would get 2 extra hp per level of endurance.
They would get 1 extra hp per level of will.

A fresh character starts with 10 mp.
They would get 10 extra hp per level of wisdom (! I want to change the current Magic attribute to Wisdom. Magic doesn't make sense as an attribute of the player's character, and I think either wisdom or intelligence captures what I wanted the magic stat to be)
They would get 4 extra mp per level of will.

A fresh character starts with a carrying capacity of 50kg (reasoning being this is theaverage of the averages of deadlifts for untrained men & women)
They would get another 2 kg of carrying capacity per level of strength.
They would get another 1 kg of carrying capacity per level of endurance.

I still need to think of how to better integrate the other attributes, but I think this is a good start for now
```