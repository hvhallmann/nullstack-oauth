import Nullstack from "nullstack";

class HelloWorldSecure extends Nullstack {
  count = 0;

  increment() {
    this.count++;
  }

  render() {
    return (
      <div>
        <h1>
          Hello Worldz
        </h1>
        <h2>
          You are in a secured area!
        </h2>
      </div>
    );
  }
}

export default HelloWorldSecure;
