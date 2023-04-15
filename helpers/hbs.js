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

  // display the Delete and Edit buttom only for the comment owner 
  commentIcons: function (blogPostUser, loggedUser, blogPostId) {
    if (loggedUser == null) {
      return ''
    }
    if (blogPostUser._id.toString() == loggedUser._id.toString() || loggedUser.adm == true) {

      return ` <div class="cotainer d-flex justify-content-evenly">
        <span m-0.5px>
          <a href="/blogPost/edit/${blogPostId}">
              <i class="btn btn-success fas fa-edit"> Edit </i> </a>
        </span>
        <span>    
          <form action="/blogPost/${blogPostId}" method="POST" id="delete-form">
              <input type="hidden" name="_method" value="DELETE">
              <button type="submit" class="btn red">
                  <i class="btn btn-danger fas fa-trash"> Delete</i>
              </button>
          </form>
        </span>
    </div>`

    } else {
      return ''
    }
  },

  dashboard: function (loggedUser) {
    if (loggedUser == null) {
      return ` <li class="nav-item">
      <a class="nav-link" href="/users/login">Login</a>
    </li>
    
    <li class="nav-item">
      <a class="nav-link" href="/users/register">Register</a>
    </li>`
    }
    if (loggedUser.adm) {

      return `
      <h4>Wellcome ${loggedUser.name} </h4>
      <li class="nav-item">
        <a class="nav-link" href="/adm/dashboard">Adm Dashboard</a>
      </li>

      <hr class="nav-divider">
      <li class="nav-item">
      <a class="nav-link" href="/users/logout"><i class="fa fa-sign-out" aria-hidden="true"></i>Logout</a>
    </li>`

    } else {
      return `
      <h4>Wellcome ${loggedUser.name} </h4>
      <li class="nav-item">
        <a class="nav-link" href="/dashboard">Your Dashboard</a>
      </li>
      
      <hr class="nav-divider">
      <li class="nav-item">
      <a class="nav-link" href="/users/logout"><i class="fa fa-sign-out" aria-hidden="true"></i>Logout</a>
    </li>`
    }
  },


}