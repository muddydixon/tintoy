import React, {Component} from "react";
import {Link} from "react-router";

export default class Header extends Component {
  render(){
    const {currentUser} = this.props;
    const nav = currentUser ?
            <nav className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
            <li><Link to="/clients">Client List</Link></li>
            <li><Link to="/signout">Signout</Link></li>
            </ul>
      </nav>:
      <nav className="collapse navbar-collapse">
      <ul className="nav navbar-nav">
      <li><Link to="/signin">Signin</Link></li>
      <li><Link to="/signup">Signup</Link></li>
      </ul>
      </nav>;

    return <header className="navbar navbar-static-top bs-docs-nav">
             <div className="container">
               <Link to="/" className="navbar-brand"><i className="fa fa-cubes" />&nbsp;TinToy</Link>
               <nav className="collapse navbar-collapse">
                 <ul className="nav navbar-nav">
                   <li><Link to="/"><i className="fa fa-list" />&nbsp;List</Link></li>
                   <li><Link to="/create"><i className="fa fa-cube" />&nbsp;Create</Link></li>
                   <li><Link to="/config"><i className="fa fa-cog" />&nbsp;Config</Link></li>
                 </ul>
               </nav>
             </div>
           </header>;
  }
}
