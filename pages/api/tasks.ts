// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import seedData from "../../seed.json";

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

let tasks: Data[] = [];

function addTasks() {
  let item = shuffle(seedData).sort(() => 0.5 - Math.random())[0];
  tasks = [...tasks, item];
}

function modifyTasks() {
  let task = shuffle(tasks).sort(() => 0.5 - Math.random())[0];
  let foundTask = tasks.find((t) => t.id === task.id);
  if (foundTask && foundTask.status === Status.pending) {
    foundTask.status = shuffle(statusOptions).sort(
      () => 0.5 - Math.random()
    )[0];
  }
}

(function runningTasks() {
  setInterval(addTasks, 5000);
  setInterval(modifyTasks, 10000);
})();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json(tasks);
}
