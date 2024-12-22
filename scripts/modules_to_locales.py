import json
import codecs

en_translations_path = r"C:\Users\User\Documents\tfd-calculator\src\locales\en.json"
ru_translations_path = r"C:\Users\User\Documents\tfd-calculator\src\locales\ru.json"
en_modules_path = r"C:\Users\User\Documents\tfd-calculator\src\api\module.json"
ru_modules_path = r"C:\Users\User\Documents\tfd-calculator\src\api\module_ru.json"

# Load the existing translations
with codecs.open(en_translations_path, encoding="utf-8") as f:
    en_translations = json.load(f)

with codecs.open(ru_translations_path, encoding="utf-8") as f:
    ru_translations = json.load(f)

# Load the module data
with codecs.open(en_modules_path, encoding="utf-8") as f:
    en_modules = json.load(f)

with codecs.open(ru_modules_path, encoding="utf-8") as f:
    ru_modules = json.load(f)

# Create the new sections
en_translations["module"]["moduleName"] = {}
en_translations["module"]["moduleStat"] = {}
ru_translations["module"]["moduleName"] = {}
ru_translations["module"]["moduleStat"] = {}

# Populate the new sections
for en_module, ru_module in zip(en_modules, ru_modules):
    en_module_name = en_module["module_name"]
    ru_module_name = ru_module["module_name"]
    en_translations["module"]["moduleName"][en_module["module_id"]] = en_module_name
    ru_translations["module"]["moduleName"][ru_module["module_id"]] = ru_module_name

    for en_stat, ru_stat in zip(en_module["module_stat"], ru_module["module_stat"]):
        en_stat_value = en_stat["value"]
        ru_stat_value = ru_stat["value"]
        en_translations["module"]["moduleStat"][en_stat_value] = en_stat_value
        ru_translations["module"]["moduleStat"][en_stat_value] = ru_stat_value

# Save the updated translations
with codecs.open(en_translations_path, "w", "utf-8") as f:
    json.dump(en_translations, f, indent=4, ensure_ascii=False)

with codecs.open(ru_translations_path, "w", "utf-8") as f:
    json.dump(ru_translations, f, indent=4, ensure_ascii=False)
