import json
import codecs

en_translations_path = r"C:\Users\User\Documents\tfd-calculator\src\locales\en.json"
ru_translations_path = r"C:\Users\User\Documents\tfd-calculator\src\locales\ru.json"
en_descendant_path = r"C:\Users\User\Documents\tfd-calculator\src\api\descendant.json"
ru_descendant_path = r"C:\Users\User\Documents\tfd-calculator\src\api\descendant_ru.json"

# Load the existing translations
with codecs.open(en_translations_path, encoding="utf-8") as f:
    en_translations = json.load(f)

with codecs.open(ru_translations_path, encoding="utf-8") as f:
    ru_translations = json.load(f)

# Load the module data
with codecs.open(en_descendant_path, encoding="utf-8") as f:
    en_descendants = json.load(f)

with codecs.open(ru_descendant_path, encoding="utf-8") as f:
    ru_descendants = json.load(f)

# Create the new sections
en_translations["overview"]["skillNames"] = {}
en_translations["overview"]["skillDescriptions"] = {}
ru_translations["overview"]["skillNames"] = {}
ru_translations["overview"]["skillDescriptions"] = {}

# Populate the new sections
for en_descendant, ru_descendant in zip(en_descendants, ru_descendants):
    for en_skill, ru_skill in zip(en_descendant["descendant_skill"], ru_descendant["descendant_skill"]):
        en_skill_name = en_skill["skill_name"]
        ru_skill_name = ru_skill["skill_name"]
        en_translations["overview"]["skillNames"][en_skill_name] = en_skill_name
        ru_translations["overview"]["skillNames"][en_skill_name] = ru_skill_name

        en_skill_description = en_skill["skill_description"]
        ru_skill_description = ru_skill["skill_description"]
        en_translations["overview"]["skillDescriptions"][en_skill_name] = en_skill_description
        ru_translations["overview"]["skillDescriptions"][en_skill_name] = ru_skill_description

# Save the updated translations
with codecs.open(en_translations_path, "w", "utf-8") as f:
    json.dump(en_translations, f, indent=4, ensure_ascii=False)

with codecs.open(ru_translations_path, "w", "utf-8") as f:
    json.dump(ru_translations, f, indent=4, ensure_ascii=False)
