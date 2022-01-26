import Nullstack from 'nullstack';
import Logo from 'nullstack/logo';

import './tailwind.css'

class Home extends Nullstack {

  prepare({ project, page }) {
    page.title = `${project.name} - Welcome to Nullstack!`;
    page.description = `${project.name} was made with Nullstack`;
  }

  renderLink({ children, href }) {
    const link = href + '?ref=create-nullstack-app';
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  render({ project }) {
    return (
      <section class="mx-24 flex flex-row">
        <article>
          <ul>
            <li>
              <a href="http://localhost:3000/client">
                ✨ OAuth
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/store/collections">
                ✨ Store Collection
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/collections">
                ✨ Collection
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/register">
                ✨ Register
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/signin">
                ✨ Login
              </a>
            </li>
          </ul>
        </article>
      </section>
    )
  }

}

export default Home;