import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import * as moment from 'moment';

import {
  Form,
  Card,
  Row,
  Col,
  Button,
  Radio,
  Select,
  DatePicker,
} from 'antd';
import { TeamInterface } from "../../interfaces";

import './TeamPicker.scss';

interface FormValuesInterface {
  seasonType: string,
  team1: string,
  team2: string,
  dateRange?: [moment.Moment, moment.Moment],
}

const TeamPicker: React.FC = () => {

  const [teams, setTeams] = useState<TeamInterface[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(true);
  const [form] = Form.useForm();
  const seasonType = Form.useWatch('seasonType', form);
  const team1 = Form.useWatch('team1', form);
  const team2 = Form.useWatch('team2', form);
  const history = useHistory();

  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY-MM-DD';

  async function fetchTeams() {
    const teamsRes = await fetch(
      `https://barnburner-backend.herokuapp.com/teams`
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

  const onFinish = (formValues: FormValuesInterface) => {

    console.log(formValues);
    const rangeValue = formValues['dateRange'];

    const values = {
     ...formValues,
     ...(rangeValue && {'dateRange': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')]}),
    };

    const baseUrl = '/matchup';
    const teamString = `?team1=${values.team1}&team2=${values.team2}`
    const dateString = values.dateRange ? `&start=${values.dateRange[0]}&end=${values.dateRange[1]}` : '';
  
    checkAllValidation() ? history.push(`${baseUrl}${teamString}${dateString}`) : console.error('Form is not validated');
  };

  const validateTeamComparison = () => {
    return team1 === team2 ? 'error' : 'success'
  }

  const checkAllValidation = () => {
    return (
      validateTeamComparison() === 'success'
    )
  }

  if(isError) { return <span> error </span> }
  if(isLoading || !teams) { return <span> loading </span> }

  return (
    <Row justify="center" align="middle">
      <Col xs={22} sm={22} md={20} lg={16}>
        <Card className="teampickerCard">
          <img className="logo" src={"/burnburner_logo.png"} />
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            layout="vertical"
            form={form}
            onFinish={onFinish}
            initialValues={{ team1: 12, team2: 6, seasonType: 'current' }}
          >
            <Row justify="center">
              <Col span={12}>
               <h1>Pick your matchup</h1>
              </Col>
            </Row>
            <Row justify="center">
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item name='team1' className="team1" validateStatus={validateTeamComparison()}>
                  <Select>
                    { teams.map((team) => (<Select.Option value={team.id} key={team.id}>{team.name}</Select.Option>)) }
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item name='team2' className="team2" validateStatus={validateTeamComparison()} help="Teams cannot be the same">
                  <Select>
                  { teams.map((team) => (<Select.Option value={team.id} key={team.id}>{team.name}</Select.Option>)) }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={12}>
               <h1>Season Type</h1>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={12}>
                <Form.Item name="seasonType"  className="center">
                  <Radio.Group>
                    <Radio.Button value="current">Current Season</Radio.Button>
                    {/* <Radio.Button value="all">All Seasons</Radio.Button> */}
                    <Radio.Button value="range">Date Range</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                { seasonType==='range' && 
                  <Form.Item name='dateRange' className="center" rules={[{ required: seasonType==='range', message: 'You must select a date range'}]}>
                    <RangePicker format={dateFormat}/>
                  </Form.Item>
                }
              </Col>
            </Row>
            <Row justify="center" >
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  GO!
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default TeamPicker;
