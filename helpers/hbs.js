const moment = require('moment')

module.exports = {
   // main format :  'MMMM Do YYYY, h:mm:ss a'
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },

  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },

// not working
  editIcon: function (blogPostUser, loggedUser, blogPostId, floating = true) {
    if (blogPostUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/adm/edit/${blogPostId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/adm/edit/${blogPostId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },


}