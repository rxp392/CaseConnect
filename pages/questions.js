import { getSession } from "next-auth/react";
import axios from "axios";

export default function Questions({ userQuestions }) {
  // return <pre>{JSON.stringify(userQuestions, null, 2)}</pre>;
  return <div>my questions</div>;
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   const data = await axios.get(`/api/protected/questions/${session.user.caseID}`);

//   console.log(data);

//   // const {
//   //   data: { userQuestions },
//   // } = await axios.get(`/api/questions/${session.user.caseID}`);

//   return {
//     props: {
//       userQuestions: [],
//     },
//   };
// }

Questions.auth = true;
