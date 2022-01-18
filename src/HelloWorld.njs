import Nullstack from "nullstack";

class HelloWorld extends Nullstack {
  count = 0;

  increment() {
    this.count++;
  }

  render() {
    return (
      <div>
        {" "}
        Hello Worldz
        <button onclick={this.increment}>{this.count} ow</button>;
      </div>
    );
  }
}

export default HelloWorld;
