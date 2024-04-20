import { Box, Text } from "@chakra-ui/layout";

const TeamListItem = ({ team, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "rgb(0, 234, 255)",
        color: "black",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Box d="flex" alignItems="center" color="black">
        <img
          src={team.team.logo}
          alt={team.team.name}
          style={{ width: "38px", height: "38px", marginRight: "8px" }}
        />
        <Box>
          <Text>{team.team.name}</Text>
          <Text fontSize="sm">
            <b>Country:</b> {team.team.country}
          </Text>
          <Text fontSize="sm">
            <b>Venue:</b> {team.venue.name}, {team.venue.city}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default TeamListItem;
