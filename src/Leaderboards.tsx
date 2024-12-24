import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Heading, View, Table, TableBody, TableCell, TableHead, TableRow } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

type LeaderboardEntry = {
  username: string;
  score: number;
  bossCount: number;
};

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/leaderboard");
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <View padding="2rem">
      <Heading level={1}>Leaderboards</Heading>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th">Rank</TableCell>
              <TableCell as="th">Username</TableCell>
              <TableCell as="th">Score</TableCell>
              <TableCell as="th">Bosses Killed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell>{entry.score}</TableCell>
                <TableCell>{entry.bossCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button onClick={fetchLeaderboard}>Refresh</Button>
      <Button onClick={() => navigate("/")}>Back to main menu</Button>
    </View>
  );
};

export default Leaderboards;
