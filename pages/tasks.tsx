import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import styles from "../styles/Home.module.css";
import { Data } from "./api/tasks";

const Tasks: NextPage = () => {
  const [data, setData] = React.useState<Data[]>([]);
  const [finishedTasks, setFinishedTasks] = React.useState<Data[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  /**
   * 1. onLoad call api/tasks
   * 2. setInterval to continue to call api/tasks every X seconds
   */
  React.useEffect(() => {
    const fetchPending = setInterval(() => {
      fetch("/api/tasks")
        .then((res) => res.json())
        .then((tasks) => {
          // There's a missing task?
          // How do we know which task is missing?
          if (tasks.length !== 0 && data?.length !== tasks.length) {
            console.log(tasks, data);
            const pendingIds = tasks.map((t: Data) => t.id);
            const noLongerPendingTasks = data.filter((task) => {
              return !pendingIds.includes(task.id);
            });
            // fetch noLongerPendingTasks by id /api/tasks/:id
            // then add to state :pointdown:
            setFinishedTasks([...finishedTasks, ...noLongerPendingTasks]);
          }
          setData(tasks);
          setIsLoading(false);
        })
        .catch((error) =>
          console.error(`There was an error fetching the data ${error}`)
        );
    }, 5000);

    return () => clearInterval(fetchPending);
  }, [data, finishedTasks]);

  if (isLoading) {
    return <p>Loading data...</p>;
  }
  if (!data) return <p>No profile data</p>;
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ul>
          {data &&
            data.map(({ name, status }, idx) => (
              <li key={idx}>
                <p>{name}</p>
                <p>
                  Status: <span style={{ color: "blue" }}>{status}...</span>{" "}
                </p>
              </li>
            ))}
        </ul>
      </main>
    </div>
  );
};

export default Tasks;
