import fs from 'node:fs/promises'
import YAML from 'yaml'

async function main() {
  const results = {}
  const fileList = await fs.readdir('./yaml')
  for (const filename of fileList) {
    const file = await fs.readFile(`./yaml/${filename}`, 'utf8')
    const json = YAML.parse(file)
    await fs.writeFile(`./json/${filename.replace('.yaml', '')}.json`, JSON.stringify(json, null, 2))
    for (const [key, val] of Object.entries(json.content)) {
      results[key] = val.name
      if (Array.isArray(val.alias)) {
        for (const alias of val.alias) {
          results[alias] = val.name
        }
      }
    }
  }

  await fs.writeFile('./json/@tags_translate_cn.json', JSON.stringify(results, null, 2))
  await fs.writeFile('./json/@tags_translate_cn.min.json', JSON.stringify(results))
}

main()
