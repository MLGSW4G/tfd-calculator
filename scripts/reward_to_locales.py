import json
import codecs

en_translations_path = r"C:\Users\User\Documents\tfd-calculator\src\locales\en.json"
ru_translations_path = r"C:\Users\User\Documents\tfd-calculator\src\locales\ru.json"
en_reward_path = r"C:\Users\User\Documents\tfd-calculator\src\api\reward.json"
ru_reward_path = r"C:\Users\User\Documents\tfd-calculator\src\api\reward_ru.json"

# Load the existing translations
with codecs.open(en_translations_path, encoding='utf-8') as f:
    en_translations = json.load(f)

with codecs.open(ru_translations_path, encoding='utf-8') as f:
    ru_translations = json.load(f)

# Load the reward files
with codecs.open(en_reward_path, encoding='utf-8') as f:
    en_reward = json.load(f)

with codecs.open(ru_reward_path, encoding='utf-8') as f:
    ru_reward = json.load(f)

# Create the new sections for maps and battle zones
en_translations["rotations"]["maps"] = {}
en_translations["rotations"]["battleZones"] = {}
ru_translations["rotations"]["maps"] = {}
ru_translations["rotations"]["battleZones"] = {}

# Populate the new sections
for en_map, ru_map in zip(en_reward, ru_reward):
    en_map_name = en_map["map_name"]
    ru_map_name = ru_map["map_name"]
    
    # Populate maps
    en_translations["rotations"]["maps"][en_map_name] = en_map_name
    ru_translations["rotations"]["maps"][en_map_name] = ru_map_name
    
    # Populate battle zones
    for en_battle_zone, ru_battle_zone in zip(en_map["battle_zone"], ru_map["battle_zone"]):
        en_battle_zone_name = en_battle_zone["battle_zone_name"]
        ru_battle_zone_name = ru_battle_zone["battle_zone_name"]

        en_translations["rotations"]["battleZones"][en_battle_zone_name] = en_battle_zone_name
        ru_translations["rotations"]["battleZones"][en_battle_zone_name] = ru_battle_zone_name

# Save the updated translations
with codecs.open(en_translations_path, 'w', encoding='utf-8') as f:
    json.dump(en_translations, f, indent=4, ensure_ascii=False)

with codecs.open(ru_translations_path, 'w', encoding='utf-8') as f:
    json.dump(ru_translations, f, indent=4, ensure_ascii=False)
    