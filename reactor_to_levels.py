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

    with open("stats.json", 'w') as f:
        json.dump(tier_data, f, indent=4)

# Example usage:
process_json_file(r'C:\Users\User\Documents\tfd-calculator\src\api\reactor.json')
