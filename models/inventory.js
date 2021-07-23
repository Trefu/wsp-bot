
const Inventory = {
    large_slots: { type: Array, default: [] },
    medium_slots: { type: Array, default: [] },
    small_slots: { type: Array, default: [] },
    backpack_slot: { type: Array },
    armor_slot: Array,
    melee_slot: Array,
    ranged_slot: Array
}

module.exports = { Inventory }