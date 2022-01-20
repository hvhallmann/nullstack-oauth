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
        <div>
          <button onclick={this.increment}>[ + ]</button>;
        </div>
        <div>
          <span>{this.count} ows</span>  
        </div>
      </div>
    );
  }
}

export default HelloWorld;
