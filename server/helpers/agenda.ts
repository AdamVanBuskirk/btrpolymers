import Agenda from "agenda";

export const agenda = new Agenda({
  db: {
    address: process.env.DATABASE_URI!, // same mongo as your app
    collection: "agendaJobs",
  },
  processEvery: "30 seconds",
  maxConcurrency: 20,
  defaultConcurrency: 5,
});

// call this on app startup
export async function startAgenda() {
  await agenda.start();
  //console.log("Agenda started");
}
