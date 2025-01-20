import { program } from 'commander';

async function getUserData(user: string) {
  const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    }, {} as Record<K, T[]>);
  try {
    const URL_GITHUB = `https://api.github.com/users/${user}/events`;
    const response = await fetch(URL_GITHUB);
    const data = await response.json();
    const res = groupBy(data, (item: any) => item.type);
    const result = Object.entries(res).map(([key, value]) => ({
      type: key,
      count: value.length,
    }));

    return result;
  } catch (error) {
    console.error('usuario no encontrado');
  }
}

program.version('0.0.1').description('Get github activity');

program.command('github-activity <user>').action(async (user) => {
  const userActivity = await getUserData(user);
  if (!userActivity) return;
  for (const actvity of userActivity) {
    console.log(`la actividad ${actvity.type} tiene ${actvity.count} eventos`);
  }
});

program.parse(process.argv);
