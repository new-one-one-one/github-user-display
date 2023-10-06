import axios, { AxiosResponse, CancelToken, isCancel } from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";

interface User {
  id: number;
  login: string;
  followers_url: string;
}

export const GitHubUserDisplay: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [followers, setFollowers] = useState<{ [username: string]: number }>(
    {},
  );
  const [completedUsers, setCompletedUsers] = useState<number>(0);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelToken | null>(null);

  useEffect(() => {
    if (cancelTokenSource) {
      // @ts-ignore
      cancelTokenSource.cancel("Request canceled due to new search query");
    }
    const source = axios.CancelToken.source();
    // @ts-ignore
    setCancelTokenSource(source);

    axios
      .get(`https://api.github.com/search/users?q=${searchQuery}`, {
        headers: {
          Authorization: "token " + process.env.REACT_APP_GITHUB_TOKEN,
        },
        cancelToken: source.token,
      })
      .then((result: AxiosResponse) => {
        const usersData: User[] = result.data.items;
        setUsers(usersData);

        const initialFollowersCount: { [username: string]: number } = {};
        usersData.forEach((user) => {
          initialFollowersCount[user.login] = 0;
        });
        setFollowers(initialFollowersCount);
        setCompletedUsers(0);
        usersData.forEach((user) => {
          fetchFollowersCount(user.login, source.token);
        });
      })
      .catch((err) => {
        if (!isCancel(err)) { console.log(err); }
      });
  }, [searchQuery]);

  const fetchFollowersCount = (
    username: string,
    cancelToken: CancelToken,
  ): void => {
    let page = 1;
    let totalCount = 0;

    const fetchPage = () => {
      axios
        .get(
          `https://api.github.com/users/${username}/followers?page=${page}`,
          {
            headers: {
              Authorization:
                "token " + process.env.REACT_APP_GITHUB_TOKEN,
            },
            cancelToken,
          },
        )
        .then((result: AxiosResponse) => {
          const pageFollowers: any[] = result.data;
          totalCount += pageFollowers.length;
          setFollowers((prevFollowers) => ({
            ...prevFollowers,
            [username]: totalCount,
          }));
          if (pageFollowers.length === 30) {
            page++;
            fetchPage();
          } else {
            setCompletedUsers((prevCount) => prevCount + 1);
          }
        })
        .catch((err) => {
          if (!isCancel(err)) {
            console.log(err);
          }
        });
    };

    fetchPage();
  };

  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (completedUsers === users.length) {
      const sortedUsers = [...users].sort((a, b) => {
        return followers[b.login] - followers[a.login];
      });

      setUsers(sortedUsers);
    }
  }, [completedUsers, followers]);

  return (
    <>
      <div className="container">
        <input
          type="text"
          placeholder="Search for GitHub users"
          value={searchQuery}
          onChange={handleSearchQuery}
        />
        <div>
          Number of users for whom counting is completed: {completedUsers}
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Login ID</th>
              <th>Number of Followers</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id}>
                <td>{user.login}</td>
                <td>{followers[user.login]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
