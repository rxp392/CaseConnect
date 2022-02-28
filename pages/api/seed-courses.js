import prisma from "lib/prisma";
import axios from "axios";
import JSSoup from "jssoup";

export default async function (req, res) {
  if (req.body.seedKey !== process.env.SEED_KEY) {
    return res.status(400).json({ error: "No seed key provided" });
  }

  const BASE_URL = "https://bulletin.case.edu";

  const pageResponse = await axios.get(`${BASE_URL}/course-descriptions/`);
  const soup = new JSSoup(pageResponse.data);

  const courses = await Promise.all(
    soup
      .findAll("a")
      .filter(
        (aTag) =>
          aTag.attrs.href && aTag.attrs.href.startsWith("/course-descriptions/")
      )
      .slice(1, -1)
      .map(async (aTag) => {
        const { data } = await axios.get(`${BASE_URL}${aTag.attrs.href}`);
        const soup = new JSSoup(data);
        return soup.findAll("strong").map((strongTag) => {
          const [number, title] = strongTag.text
            .split(". ")
            .slice(0, 2)
            .map((s) => s.replace("Â", "").trim());
          return {
            number,
            title,
          };
        });
      })
  )
    .then((courseArrays) => [].concat(...courseArrays))
    .then((courses) =>
      courses.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (_value) =>
              _value.courseNumber === value.courseNumber &&
              _value.courseTitle === value.courseTitle
          )
      )
    );

  await prisma.course.createMany({
    data: courses.map(({ number, title }) => ({
      number,
      title,
    })),
  });

  return res.status(200).json({ success: true });
}
