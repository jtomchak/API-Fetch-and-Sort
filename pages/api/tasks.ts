// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import seedData from "../../seed.json";
import { faker } from "@faker-js/faker";

enum Status {
  "pending" = "pending",
  "delay" = "delay",
  "success" = "success",
  "failure" = "failure",
}

const statusOptions = [
  Status.pending,
  Status.delay,
  Status.success,
  Status.failure,
];

export type Data = {
  name: string;
  status: Status;
  id: string;
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

let numberofTasks = 0;
let tasks: Data[] = [];
let finishedTasks: Data[] = [];

// function addTasks() {
//   numberofTasks = numberofTasks + 1;
//   console.log(numberofTasks);
//   let item = {
//     name: faker.name.firstName(),
//     id: faker.finance.iban(),
//     status: Status.pending,
//   };
//   tasks = [...tasks, item];
// }

function modifyTasks() {
  let task = shuffle(tasks).sort(() => 0.5 - Math.random())[0];
  let foundTask = tasks.find((t) => t.id === task.id);
  if (foundTask && [Status.pending, Status.delay].includes(foundTask.status)) {
    foundTask.status = shuffle([Status.success, Status.failure]).sort(
      () => 0.5 - Math.random()
    )[0];
  }
  tasks = tasks.filter((task) => {
    if (["success", "failure"].includes(task.status)) {
      finishedTasks.push(task);
      console.log(finishedTasks);
      return false;
    } else {
      return true;
    }
  });
}

(function runningTasks() {
  const addingPendingTasks = setInterval(() => {
    numberofTasks = numberofTasks + 1;
    if (numberofTasks > 5) {
      clearInterval(addingPendingTasks);
    }
    console.log(numberofTasks);
    let item = {
      name: faker.name.firstName(),
      id: faker.finance.iban(),
      status: Status.pending,
    };
    tasks = [...tasks, item];
  }, 5000);
  setInterval(modifyTasks, 10000);
})();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json(tasks);
}
