import React, { Component } from 'react';
import DecisionMatrix from './DecisionMatrix.js';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import logo from './logo.svg';
import './App.css';
import {
  actionApply,
  actionNotApply,
  actionChallenge,
  actionNotChallenge,
  actionAccept,
  actionReject,
  actionAbstain,
  Player,
  TCR
} from './tcr'

const styles = theme => ({
  app: {
    padding: theme.spacing.unit * 2,
  },
  success: {
    color: "#43A047",
  },
  error: {
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  paperBestStrategy: {
    background: '#E8F5E9',
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '150px',
  },
});

class App extends Component {
  constructor() {
    super(...arguments);
    const tcr = new TCR({
      minDeposit: 5,
      dispensationPct: 0.5,
      minorityBlocSlash: 0.1,
      voteQuorum: 0.5,
      applicationEffort: 0,
      challengeEffort: 0,
      voteEffort: 0,
      players: [
        new Player({ tokens: 5, action: actionChallenge }),
        new Player({ tokens: 5, action: actionApply, registryValue: 100, quality: 1 }),
        new Player({ tokens: 10, action: actionAbstain }),
        new Player({ tokens: 10, action: actionAbstain }),
        new Player({ tokens: 10, action: actionAbstain }),
      ]
    })
    tcr.challenger = tcr.players[0].id;
    tcr.candidate = tcr.players[1].id;
    this.state = { tcr };
  }

  setGameProperty(property) {
    return (e) => {
      this.state.tcr[property] = e.target.value;
      this.forceUpdate();
    }
  }

  setPlayerProperty(player, property) {
    return (e) => {
      player[property] = e.target.value;
      this.forceUpdate();
    }
  }

  setAction() {
    return (player, action) => {
      player.action = action;
      this.forceUpdate();
    }
  }

  setVoters() {
    return (e) => {
      const { tcr } = this.state
      const numVoters = Number(e.target.value);
      const newVoters = new Array(numVoters).fill().map(() => {
        return new Player({ tokens: 10, action: actionAbstain })
      })
      const players = tcr.players.slice(0, 2).concat(newVoters)
      tcr.players = players
      this.forceUpdate();
    }
  }

  render() {
    const { classes } = this.props;
    const { tcr } = this.state;
    const gameData = tcr.getGameData();
    const {
      candidate,
      challenger,
      voters
    } = gameData;
    const numVoters = voters.length

    return (
      <div className="App" className={classes.app}>
        <Grid container spacing={24}>
          <Grid item sm={6}>
            <Paper className={classes.paper}>
              <h2>TCR Parameters</h2>
              <TextField
                id="number"
                label="MIN_DEPOSIT"
                value={tcr.minDeposit}
                onChange={this.setGameProperty("minDeposit")}
                type="number"
                inputProps={{ min: "0" }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                className={classes.textField}
              />
              <TextField
                id="number"
                label="DISPENSATION_PCT"
                value={tcr.dispensationPct}
                onChange={this.setGameProperty("dispensationPct")}
                type="number"
                inputProps={{ min: "0", max: "1", step: "0.1" }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                className={classes.textField}
              />
              <TextField
                id="number"
                label="MINORITY_BLOC_SLASH"
                value={tcr.minorityBlocSlash}
                onChange={this.setGameProperty("minorityBlocSlash")}
                type="number"
                inputProps={{ min: "0", max: "1", step: "0.1" }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                className={classes.textField}
              />
              <TextField
                id="number"
                label="VOTE_QUORUM"
                value={tcr.voteQuorum}
                onChange={this.setGameProperty("voteQuorum")}
                type="number"
                inputProps={{ min: "0", max: "1", step: "0.1" }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                className={classes.textField}
              />
            </Paper>
          </Grid>
          <Grid item sm={6}>
            <Paper className={classes.paper}>
              <h2>Other Parameters</h2>
              <TextField
                id="number"
                label="Application Effort"
                value={tcr.applicationEffort}
                onChange={this.setGameProperty("applicationEffort")}
                type="number"
                inputProps={{ min: "0" }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                className={classes.textField}
              />
              <TextField
                id="number"
                label="Challenge Effort"
                value={tcr.challengeEffort}
                onChange={this.setGameProperty("challengeEffort")}
                type="number"
                inputProps={{ min: "0" }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                className={classes.textField}
              />
              <TextField
                id="number"
                label="Vote Effort"
                value={tcr.voteEffort}
                onChange={this.setGameProperty("voteEffort")}
                type="number"
                inputProps={{ min: "0" }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                className={classes.textField}
              />
              <TextField
                id="number"
                label="Number of Voters"
                value={numVoters}
                onChange={this.setVoters()}
                type="number"
                inputProps={{ min: "1" }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                className={classes.textField}
              />
            </Paper>
          </Grid>
          <Grid item sm={12}>
            <Grid container spacing={24}>
              <Grid item sm={6} md={6}>
                <Paper className={candidate.player.action === candidate.bestStrategy ? classes.paperBestStrategy : classes.paper}>
                  <h2>Candidate</h2>
                  <TextField
                    id="number"
                    label="Listing Valuation"
                    value={candidate.player.registryValue}
                    onChange={this.setPlayerProperty(candidate.player, "registryValue")}
                    type="number"
                    inputProps={{ min: "0" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    className={classes.textField}
                  />
                  <TextField
                    id="number"
                    label="Quality"
                    value={candidate.player.quality}
                    onChange={this.setPlayerProperty(candidate.player, "quality")}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    className={classes.textField}
                  />
                  <TextField
                    id="number"
                    label="Tokens"
                    value={candidate.player.tokens}
                    onChange={this.setPlayerProperty(candidate.player, "tokens")}
                    type="number"
                    inputProps={{ min: "0" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    className={classes.textField}
                  />
                  {
                    candidate.player.action === candidate.bestStrategy
                      ? (<Icon className={classes.success}>check</Icon>)
                      : (<Icon className={classes.error}>close</Icon>)
                  }
                  <DecisionMatrix player={candidate} setAction={this.setAction()}/>
                </Paper>
              </Grid>
              <Grid item sm={6} md={6}>
                <Paper className={challenger.player.action === challenger.bestStrategy ? classes.paperBestStrategy : classes.paper}>
                  <h2>Challenger</h2>
                  <TextField
                    id="number"
                    label="Tokens"
                    value={challenger.player.tokens}
                    onChange={this.setPlayerProperty(challenger.player, "tokens")}
                    type="number"
                    inputProps={{ min: "0" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    className={classes.textField}
                  />
                  {
                    challenger.player.action === challenger.bestStrategy
                      ? (<Icon className={classes.success}>check</Icon>)
                      : (<Icon className={classes.error}>close</Icon>)
                  }
                  <DecisionMatrix player={challenger} setAction={this.setAction()}/>
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={24}>
              {
                voters.map((voter, index) => {
                  return (
                    <Grid item sm={6} md={4} key={index}>
                      <Paper className={voter.player.action === voter.bestStrategy ? classes.paperBestStrategy : classes.paper}>
                        <h2>Voter</h2>
                        <TextField
                          id="number"
                          label="Tokens"
                          value={voter.player.tokens}
                          onChange={this.setPlayerProperty(voter.player, "tokens")}
                          type="number"
                          inputProps={{ min: "0" }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                          className={classes.textField}
                        />
                        {
                          voter.player.action === voter.bestStrategy
                            ? (<Icon className={classes.success}>check</Icon>)
                            : (<Icon className={classes.error}>close</Icon>)
                        }
                        <DecisionMatrix player={voter} setAction={this.setAction()}/>
                      </Paper>
                    </Grid>
                  )
                })
              }
            </Grid>
          </Grid>
          <Grid item sm={12}>
            <Paper className={classes.paper}>
              <h2>Outcome</h2>
              <span>
                Equilibrium?
                {
                  gameData.isEquilibrium
                    ? (<Icon style={{ fontSize: 22 }} className={classes.success}>check</Icon>)
                    : (<Icon style={{ fontSize: 22 }} className={classes.error}>close</Icon>)
                }
              </span>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
