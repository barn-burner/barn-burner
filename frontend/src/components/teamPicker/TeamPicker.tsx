import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import * as moment from 'moment';

import {
  Form,
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
  const [form] = Form.useForm();
  const seasonType = Form.useWatch('seasonType', form);
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
  
    history.push(`${baseUrl}${teamString}${dateString}`);
  };

  if(isError) { return <span> error </span> }
  if(isLoading || !teams) { return <span> loading </span> }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{ team1: 12, team2: 6, seasonType: 'current' }}
    >
      <Form.Item label="Team 1" name='team1'>
        <Select>
          { teams.map((team) => (<Select.Option value={team.id} key={team.id}>{team.name}</Select.Option>)) }
        </Select>
      </Form.Item>
      <Form.Item label="Team 2" name='team2'>
        <Select>
        { teams.map((team) => (<Select.Option value={team.id} key={team.id}>{team.name}</Select.Option>)) }
        </Select>
      </Form.Item>
      <Form.Item label="Season Type" name="seasonType">
        <Radio.Group>
          <Radio.Button value="current">Current Season</Radio.Button>
          {/* <Radio.Button value="all">All Seasons</Radio.Button> */}
          <Radio.Button value="range">Date Range</Radio.Button>
        </Radio.Group>
      </Form.Item>
      { seasonType==='range' && 
        <Form.Item label='Date Range' name='dateRange'>
          <RangePicker format={dateFormat}/>
        </Form.Item>
      }
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TeamPicker;
