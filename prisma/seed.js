const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const JSSoup = require("jssoup").default;

const prisma = new PrismaClient();

const fetchCourses = async () => {
  const BASE_URL = "https://bulletin.case.edu";

  const pageResponse = await axios.get(`${BASE_URL}/course-descriptions/`);
  const soup = new JSSoup(pageResponse.data);

  return await Promise.all(
    soup
      .findAll("a")
      .filter(
        (aTag) =>
          aTag.attrs.href && aTag.attrs.href.startsWith("/course-descriptions/")
      )
      .slice(1, -1)
      .map(async (aTag) => {
        const { data } = await axios.get(`${BASE_URL}${aTag.attrs.href}`);
        const _soup = new JSSoup(data);
        const strongTags = _soup.findAll("strong");
        return strongTags.map((strongTag) =>
          strongTag.text
            .split(". ")
            .slice(0, 2)
            .join(". ")
            .replace("&#160;", " ")
        );
      })
  )
    .then((courseArrays) => [].concat(...courseArrays))
    .then((courses) =>
      courses.filter(
        (value, index, self) =>
          index === self.findIndex((_value) => _value === value)
      )
    );
};

async function main() {
  console.log(`Started seeding ...`);
  const courses = await fetchCourses();
  await prisma.course.createMany({
    data: courses.map((courseName) => ({
      courseName,
    })),
  });
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
