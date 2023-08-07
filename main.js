import { group, sleep } from "k6"
import GetTest from './scenarios/script.js'



export default () => {
    group('Get endpoints group', () => {
        GetTest();
    });
    sleep(1);
}