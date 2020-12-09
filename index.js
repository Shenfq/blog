const fs = require('fs-extra')
const glob = require('glob')

const files = glob.sync('blog/posts/**/*.md')

files.forEach(file => {
  console.log(file)
  let content = fs.readFileSync(file, 'utf8')
  const idx = content.indexOf('date:')
  content = content.slice(0, idx) + '' + content.slice(idx)
  console.log(content.slice(0, idx))
})