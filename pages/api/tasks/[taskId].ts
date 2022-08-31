import type { NextApiRequest, NextApiResponse } from "next";
import type { Data } from ".";
import { finishedTasks } from ".";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | undefined>
) {
  const { taskId } = req.query;

  const task = finishedTasks.find((task) => task.id === taskId);

  console.log(">>>>>CHECK", finishedTasks, taskId);
  res.status(200).json(task);
}
