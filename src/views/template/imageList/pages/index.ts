const modules: { [key: string]: any; } = {}
const files = import.meta.glob('./*.vue')

for (const path in files) {
  files[path]().then(mod => {
    const matched = path.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      modules[matched[1]] = mod
    }
  })
}

export default modules
