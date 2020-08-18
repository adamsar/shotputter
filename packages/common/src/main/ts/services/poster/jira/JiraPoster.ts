/**
 *    const fields = {
      project: {
        key: config.projectKey
      },
      summary: bug.summary,
      issuetype: {
        name: config.bugIssueName
      },
      priority: {
        id: priority
      },
      description: bug.description
    };
 */

export interface JiraPoster {
    post: (project: string, priorityId: string, summary: string, message: string, image: string) => void;
}
