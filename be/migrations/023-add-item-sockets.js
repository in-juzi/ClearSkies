const mongoose = require('mongoose');

/**
 * Adds the optional `sockets` field to inventory (and storage container) item
 * instances — the sparse list of filled sockets used by the enchanting/sigil
 * system. See project/ideas/enchanting.md.
 *
 * No backfill is required: the field is optional (default undefined) and all
 * read paths treat an absent `sockets` as "no sockets filled". This migration
 * is recorded for schema-change traceability and is a safe no-op on data.
 */
async function up() {
  // Intentionally a no-op: `sockets` is additive + optional, absent === empty.
  // Existing items need no modification; new sockets are written by the
  // socketing action (playerInventoryService.socketItem).
  return {
    modified: 0,
    message: 'Schema-only change: optional item `sockets` field added (no data backfill needed)'
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Rollback: strip any sockets that were written, from inventory + storage.
  const result = await Player.updateMany(
    {},
    {
      $unset: {
        'inventory.$[].sockets': '',
        'storageContainers.$[].items.$[].sockets': ''
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed item sockets from ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '023-add-item-sockets',
  description: 'Adds optional `sockets` field to inventory/storage item instances for the enchanting/sigil system'
};
