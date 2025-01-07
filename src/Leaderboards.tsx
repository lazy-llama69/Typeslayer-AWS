import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Heading, View, Table, TableBody, TableCell, TableHead, TableRow, Flex } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

type LeaderboardEntry = {
  username: string;
  score: number;
  bossCount: number;
};

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("https://5sovduu1i1.execute-api.ap-southeast-2.amazonaws.com/dev/leaderboard");
      
      // JSON-nify the response to be readable
      setLeaderboard(JSON.parse(response.data.body).leaderboardData);
      // console.log("This is the response:",JSON.parse(response.data.body).leaderboardData);
      // console.log("This is the leaderboard:",leaderboard);  
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } 
    console.log("Fetching leaderboard...")
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []); //This effect loads the leaderboard

  return (
    <View padding="2rem">
      <Flex  direction="row" gap="0.5rem" justifyContent="center" alignItems="center">
        <Heading level={1}>Leaderboards</Heading>
      </Flex> 
        <Table variation="bordered">
          <TableHead textAlign='center'>
            <TableRow>
              <TableCell as="th" textAlign='center'>Rank</TableCell>
              <TableCell as="th" textAlign='center'>Username</TableCell>
              <TableCell as="th" textAlign='center'>Score</TableCell>
              <TableCell as="th" textAlign='center'>Bosses Killed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={index}>
                <TableCell textAlign='center'>{index + 1}</TableCell>
                <TableCell textAlign='center'>{entry.username}</TableCell>
                <TableCell textAlign='center'>{entry.score}</TableCell>
                <TableCell textAlign='center'>{entry.bossCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      <Flex direction="row" gap="0.5rem" justifyContent="center" alignItems="center" margin="1rem"> 
        <Button onClick={fetchLeaderboard}>Refresh</Button>
        <Button variation="primary" onClick={() => navigate("/")}>Return to main menu</Button>
      </Flex> 

    </View>
  );
};

export default Leaderboards;
