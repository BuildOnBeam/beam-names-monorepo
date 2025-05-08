import { BeamClient } from '@onbeam/sdk';
import { beamConfig } from './config';

const beamClient = new BeamClient(beamConfig);

const beamProvider = beamClient.connectProvider();

export { beamClient, beamProvider };
