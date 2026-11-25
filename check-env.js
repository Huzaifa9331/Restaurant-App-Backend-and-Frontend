import "dotenv/config";

const uri = process.env.MONGO_URI || "";
const m = uri.match(/^mongodb(?:\+srv)?:\/\/([^:]*):(.*)@([^@/]*)\/?([^?]*)/);

console.log("Line count in URI:", uri.split("\n").length);
console.log("Username  :", m ? JSON.stringify(m[1]) : "NO MATCH");
console.log("Pass length:", m ? m[2].length : "NO MATCH");
console.log("Pass has < > or space:", m ? /[<>\s"']/.test(m[2]) : "NO MATCH");
console.log("Host      :", m ? m[3] : "NO MATCH");
console.log("Database  :", m ? m[4] : "NO MATCH");