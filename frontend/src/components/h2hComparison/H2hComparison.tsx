import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Button, Row, Col } from "antd";

import Page from "../page";
import { TeamInterface } from "../../interfaces";
import { SeasonSelector } from "../seasonSelector";

const H2hComparison: React.FC = () => {
  const [teams, setTeams] = useState<TeamInterface[]>([]);
  const [team1Id, setTeam1Id] = useState("1");
  const [team2Id, setTeam2Id] = useState("2");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTeams() {
    const teamsRes = await fetch(
      `http://barnburner-backend.herokuapp.com/teams`
    );
    if (teamsRes.ok) {
      const teamsData = await teamsRes.json();
      setTeams(teamsData);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (teams?.length < 1) {
      fetchTeams();
      console.log(teams);
    }
  }, [teams]);

  const teamItems = () => {
    return teams?.map(({ name, id }) => ({ label: name, key: id }));
  };

  const menu1 = (
    <Menu
      selectable
      onClick={({ key }) => setTeam1Id(key)}
      items={teamItems()}
    />
  );
  const menu2 = (
    <Menu onClick={({ key }) => setTeam2Id(key)} items={teamItems()} />
  );

  if (isError) {
    return <span> error </span>;
  }
  if (isLoading || !teams) {
    return <span> loading </span>;
  }

  return (
    <Page title="H2h Comparison">
      <Row justify="center">
        <Col xs={24} sm={24} md={20} lg={16}>
          <Row>
            <Col span={11}>
              <div>Choose Teams to compare</div>
            </Col>
          </Row>
          <div>
            <Row>
              <Col span={6}>
                <Dropdown
                  overlay={menu1}
                  placement="bottom"
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      {teams[Number(team1Id) - 1]?.name}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </Col>
              <Col span={6}>
                <Dropdown
                  overlay={menu2}
                  placement="bottom"
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      {teams[Number(team2Id) - 1]?.name}
                      {console.log(team2Id)}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </Col>
            </Row>
          </div>
          <SeasonSelector />
          <Button>
            <a href={`/matchup?team1=${team1Id}&team2=${team2Id}`}>
              Compare two teams
            </a>
          </Button>
        </Col>
      </Row>
    </Page>
  );
};

export default H2hComparison;
