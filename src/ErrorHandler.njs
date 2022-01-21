import Nullstack from "nullstack";

class ErrorHandler extends Nullstack {

  render() {
    return (
      <section>
        <aside>
          <img src="/nulla-chan.webp" alt="Nulla-Chan: Nullstack's official waifu" height={550} width={400} />
        </aside>
        <article>
          <div>
            <h1>
              Ops, something bad happened!
            </h1>
          </div>
        </article>
      </section>
    );
  }
}

export default ErrorHandler;
