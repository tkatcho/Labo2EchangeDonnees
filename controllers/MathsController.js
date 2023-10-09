import Controller from "./Controller.js";
import fs from "fs";
import * as path from 'path';

export default class MathsController extends Controller {
  constructor(HttpContext) {
    super(HttpContext);
    this.params = HttpContext.path.params;
  }

  get() {
    if (this.HttpContext.path.queryString == "?") {
      this.help();
    } else {
      this.doOperation();
    }
  }

  doOperation() {
    let { op, x, y, n } = this.HttpContext.payload;

    if (op == " ") op = "+";
    let result = this.HttpContext.payload;
    result.op = op;

    //#region class verifiy mais modifier
    if (result.op != null) {
      switch (result.op) {
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          if (Object.keys(result).length != 3) {
            result.error = "invalid amount of parameters 1";
            return this.HttpContext.response.JSON(result);
          }
          if (result.x == null) {
            result.error = "param x is null";
            return this.HttpContext.response.JSON(result);
          }
          if (isNaN(parseInt(result.x))) {
            result.error = "param x is not a number";
            return this.HttpContext.response.JSON(result);
          }
          if (result.y == null) {
            result.error = "param y is null";
            return this.HttpContext.response.JSON(result);
          }
          if (isNaN(parseInt(result.y))) {
            result.error = "param y is not a number";
            return this.HttpContext.response.JSON(result);
          }
          break;
        case "!":
        case "p":
        case "np":
          if (Object.keys(result).length != 2) {
            result.error = "invalid amount of parameters 2";
            return this.HttpContext.response.JSON(result);
          }
          if (result.n == null) {
            result.error = "n parameter is null";
            return this.HttpContext.response.JSON(result);
          }
          if (isNaN(parseInt(result.n))) {
            result.error = "n param is not a number";
            return this.HttpContext.response.JSON(result);
          }
          if (/[\.]/.test(String(result.n))) {
            result.error = "n param is invalid";
            return this.HttpContext.response.JSON(result);
          }
          if (parseInt(result.n) <= 0) {
            result.error = "n param must be bigger than 0";
            return this.HttpContext.response.JSON(result);
          }
      }
    }
    //#endregion

    x = parseInt(x);
    y = parseInt(y);
    n = parseInt(n);

    //SWITCH CASE
    switch (op) {
      case "+":
        return this.HttpContext.response.JSON({
          op: op,
          x: x,
          y: y,
          value: x + y,
        });
      case "-":
        return this.HttpContext.response.JSON({
          op: op,
          x: x,
          y: y,
          value: x - y,
        });
      case "/":
        if (y == 0 && x == 0) {
          return this.HttpContext.response.JSON({
            op: op,
            x: x,
            y: y,
            value: "NaN",
          });
        }
        if (y == 0) {
          return this.HttpContext.response.JSON({
            op: op,
            x: x,
            y: y,
            value: "Infinity",
          });
        }
        return this.HttpContext.response.JSON({
          op: op,
          x: x,
          y: y,
          value: x / y,
        });
      case "*":
        return this.HttpContext.response.JSON({
          op: op,
          x: x,
          y: y,
          value: x * y,
        });
      case "%":
        if (y == 0) {
          return this.HttpContext.response.JSON({
            op: op,
            x: n,
            error: "cannot modulo with 0",
          });
        }
        return this.HttpContext.response.JSON({
          op: op,
          x: x,
          y: y,
          value: x % y,
        });
      case "p":
        return this.HttpContext.response.JSON({
          op: op,
          n: n,
          value: isPrime(n),
        });
      case "!":
        return this.HttpContext.response.JSON({
          op: op,
          n: n,
          value: factorial(n),
        });
      case "np":
        return this.HttpContext.response.JSON({
          op: op,
          n: n,
          value: findPrime(n),
        });
      default:
        return this.HttpContext.response.notFound(
          "This operator does not exist"
        );
    }
  }
  help() {
    let helpPagePath = path.join(
      process.cwd(),
      wwwroot,
      "API-Help-Pages/API-MAths-help.html"
    );
    console.log(path);
    this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
  }
}
//#region Functions
function valideInt(x) {
  if (!isNaN(x) && x != null) return true;
  else return false;
}
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

function isPrime(value) {
  for (var i = 2; i < value; i++) {
    if (value % i === 0) {
      return false;
    }
  }
  return value > 1;
}

function findPrime(n) {
  let primeNumer = 0;
  for (let i = 0; i < n; i++) {
    primeNumer++;
    while (!isPrime(primeNumer)) {
      primeNumer++;
    }
  }
  return primeNumer;
}
//#endregion
