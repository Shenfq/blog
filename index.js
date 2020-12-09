const fs = require('fs-extra')
const glob = require('glob')

const files = glob.sync('blog/posts/**/*.md')

files.forEach(file => {
  console.log(file)
  let content = fs.readFileSync(file, 'utf8')
  const match = content.match(/title: ([^\r\n]+)/)
  const title = match && match[1]
  if (!title) {
    return
  }
  const idx = content.indexOf('---', 4)
  content = content.slice(0, idx + 3) + '\n\n#' + title + content.slice(idx + 3)
  fs.writeFileSync(file, content)
})