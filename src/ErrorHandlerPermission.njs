import Nullstack from "nullstack";

class ErrorHandlerPermission extends Nullstack {

  render() {
    return (
      <section>
        <aside>
          <img src="/nulla-chan.webp" alt="Nulla-Chan: Nullstack's official waifu" height={550} width={400} />
        </aside>
        <article>
          <div>
            <h1>
              Ops, You do not have permission!
            </h1>
          </div>
          <a href="http://localhost:3000/client">
            ✨ Back to login page
          </a>
        </article>
      </section>
    );
  }
}

export default ErrorHandlerPermission;
