"""Produces a stats.json file formatted as:
{
    "level": {
        "skill_atk_power": reactorSkillPower,
        "sub_skill_atk_power": subSkillPower
    }
}
"""

import json

def process_json_file(json_file_path):
    with open(json_file_path, 'r') as f:
        data = json.load(f)

    tier_data = {}

    for reactor in data:
        for skill_power in reactor['reactor_skill_power']:
            level = skill_power['level']
            skill_atk_power = skill_power['skill_atk_power']
            sub_skill_atk_power = skill_power['sub_skill_atk_power']
            tier_data[level] = {"skill_atk_power": skill_atk_power, "sub_skill_atk_power": sub_skill_atk_power}

    with open("ReactorLevels.json", 'w') as file:
        json.dump(tier_data, file, indent=4)


process_json_file(r'C:\Users\User\Documents\tfd-calculator\src\api\reactor.json')
