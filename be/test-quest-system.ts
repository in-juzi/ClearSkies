/**
 * Quick test script to verify quest system is working
 * Run with: npx ts-node -r tsconfig-paths/register test-quest-system.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Player from './models/Player';
import questService from './services/questService';

async function testQuestSystem() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✓ Connected to MongoDB\n');

    // Find a player with tutorial_welcome active
    const player = await Player.findOne({ 'quests.active.questId': 'tutorial_welcome' });

    if (!player) {
      console.log('✗ No player found with tutorial_welcome quest');
      process.exit(1);
    }

    console.log('📋 Testing Quest System');
    console.log('='.repeat(60));
    console.log(`Player ID: ${player._id}`);
    console.log(`Current Location: ${player.currentLocation}`);
    console.log();

    // Test 1: Get active quests
    console.log('Test 1: Get Active Quests');
    const activeQuests = questService.getActiveQuests(player);
    console.log(`  ✓ Active quests: ${activeQuests.length}`);
    activeQuests.forEach((q: any, i: number) => {
      console.log(`    ${i + 1}. ${q.questId}`);
      q.objectives.forEach((obj: any) => {
        console.log(`       - ${obj.objectiveId}: ${obj.current}/${obj.required} ${obj.completed ? '✓' : '✗'}`);
      });
    });
    console.log();

    // Test 2: Get available quests
    console.log('Test 2: Get Available Quests');
    const availableQuests = questService.getAvailableQuests(player);
    console.log(`  ✓ Available quests: ${availableQuests.length}`);
    availableQuests.forEach((q: any, i: number) => {
      console.log(`    ${i + 1}. ${q.questId} - ${q.name}`);
    });
    console.log();

    // Test 3: Simulate visiting fishing dock (complete objective)
    console.log('Test 3: Simulate Location Visit (Fishing Dock)');
    console.log('  → Updating location to kennik...');
    player.currentLocation = 'kennik';
    if (!player.discoveredLocations.includes('kennik')) {
      player.discoveredLocations.push('kennik');
    }

    console.log('  → Calling onLocationDiscovered with facilityId: fishing_dock...');
    const result = await questService.onLocationDiscovered(player, 'kennik', 'fishing_dock');
    console.log(`  ✓ Objectives updated: ${result.objectives.length}`);

    if (result.objectives.length > 0) {
      result.objectives.forEach((obj: any) => {
        console.log(`    - ${obj.objectiveId}: ${obj.current}/${obj.required} ${obj.completed ? '✓ COMPLETED' : '✗'}`);
      });
    }

    console.log(`  ✓ New quests unlocked: ${result.newQuests.length}`);
    if (result.newQuests.length > 0) {
      result.newQuests.forEach((q: any) => {
        console.log(`    - ${q.questId} (${q.name}) - AUTO-ACCEPTED`);
      });
    }
    console.log();

    // Test 4: Check if quest is ready to turn in
    console.log('Test 4: Check Quest Completion Status');
    const canTurnIn = questService.areAllObjectivesCompleted(player, 'tutorial_welcome');
    console.log(`  ${canTurnIn ? '✓' : '✗'} Quest ready to turn in: ${canTurnIn}`);
    console.log();

    // Test 5: Turn in quest if complete
    if (canTurnIn) {
      console.log('Test 5: Turn In Quest');
      const turnInResult = await questService.turnInQuest(player, 'tutorial_welcome');

      if (turnInResult.success) {
        console.log(`  ✓ ${turnInResult.message}`);
        console.log('  Rewards:');
        if (turnInResult.rewards?.gold) {
          console.log(`    - Gold: ${turnInResult.rewards.gold}`);
        }
        if (turnInResult.rewards?.unlocks?.quests) {
          console.log(`    - Unlocked quests: ${turnInResult.rewards.unlocks.quests.join(', ')}`);
        }

        // Check if next quest auto-accepted
        const newActiveQuests = questService.getActiveQuests(player);
        console.log(`  ✓ New active quests: ${newActiveQuests.length}`);
        newActiveQuests.forEach((q: any) => {
          console.log(`    - ${q.questId}`);
        });
      } else {
        console.log(`  ✗ ${turnInResult.message}`);
      }
      console.log();
    }

    // Final status
    console.log('📊 Final Status');
    console.log('='.repeat(60));
    console.log(`Active quests: ${player.quests.active.length}`);
    console.log(`Completed quests: ${player.quests.completed.length}`);
    console.log(`Gold: ${player.gold}`);
    console.log();

    // Don't save changes (this is just a test)
    console.log('⚠️  Changes NOT saved to database (test mode)');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

testQuestSystem();
