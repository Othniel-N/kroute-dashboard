import express from 'express';
import * as k8s from '@kubernetes/client-node';
import axios from 'axios';

const router = express.Router();

const slackWebhookUrl = 'https://hooks.slack.com/services/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';

// Function to send a message to Slack
async function sendSlackMessage(message) {
  try {
    await axios.post(slackWebhookUrl, { text: message });
    console.log('Slack message sent successfully');
  } catch (error) {
    console.error('Error sending Slack message:', error.message);
  }
}

// Function to check for pending pods and send notifications
async function checkAndNotify() {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    // Retrieve information about pods
    const podResponse = await k8sApi.listPodForAllNamespaces();

    // Filter pods that are in the 'Pending', 'Unknown', or 'Terminating' phase
    const relevantPods = podResponse.body.items.filter((pod) => {
      const phase = pod.status.phase;
      return !phase || phase === 'Pending' || phase === 'Unknown' || phase === 'Terminating' || phase === 'CrashLoopBackOff' || phase === 'Error';
    });

    // Extract relevant information for each pod
    // Extract relevant information for each pod
const podInfo = await Promise.all(relevantPods.map(async (pod) => {
  const podName = pod.metadata.name;
  const namespace = pod.metadata.namespace;

  // Retrieve detailed information for the pod
  const podDetailsResponse = await k8sApi.readNamespacedPod(podName, namespace);

  const containerStatuses = podDetailsResponse.body.status.containerStatuses;

  if (containerStatuses && Array.isArray(containerStatuses)) {
    const reason = containerStatuses.map((containerStatus) => {
      if (containerStatus.state && containerStatus.state.waiting) {
        return containerStatus.state.waiting.reason;
      } else {
        return null;
      }
    }).filter((item) => item !== null).join(', ');

    return `*PodName:* ${podName}\n*Namespace:* ${namespace}\n*Phase:* ${pod.status.phase}\n*Reason:* \`${reason}\`\n\n`;
  } else {
    return `*PodName:* ${podName}\n*Namespace:* ${namespace}\n*Phase:* ${pod.status.phase}\n*Reason:* Not available\n\n`;
  }
}));


    // Retrieve information about nodes
    const nodeResponse = await k8sApi.listNode();
    const notReadyNodes = nodeResponse.body.items.filter((node) => {
      return !node.status.conditions.some((condition) => condition.type === 'Ready' && condition.status === 'True');
    });

    // Extract relevant information for each not ready node
    const notReadyNodeInfo = notReadyNodes.map((node) => {
      const nodeName = node.metadata.name;
      return `*NodeName:* ${nodeName}\n*Status:* ${node.status.conditions.map((condition) => `${condition.type}: ${condition.status}`).join(', ')}\n\n`;
    });

    // Check if there are relevant pods or not ready nodes and send a message to Slack
    if (podInfo.length > 0 || notReadyNodeInfo.length > 0) {
      const slackMessage = `:robot_face: KROUTE BOT \nThere are relevant pods or nodes not ready in the Kubernetes cluster. :octagonal_sign: Action may be required.\n\nDetails:\n${podInfo.join('\n')}${notReadyNodeInfo.join('\n')}`;
      await sendSlackMessage(slackMessage);
    }
  } catch (error) {
    console.error('Error checking and notifying:', error);
  }
}

// Set up the interval to check for pending pods every 5 minutes (300,000 milliseconds)
const intervalId = setInterval(checkAndNotify, 1000);

// Endpoint to manually trigger the check (optional)
router.get('/check', async (req, res) => {
  await checkAndNotify();
  res.json({ message: 'Manual check triggered.' });
});

process.on('SIGINT', () => {
  clearInterval(intervalId);
  process.exit();
});
const podInfo = await Promise.all(relevantPods.map(async (pod) => {
  const podName = pod.metadata.name;
  const namespace = pod.metadata.namespace;

  // Retrieve detailed information for the pod
  const podDetailsResponse = await k8sApi.readNamespacedPod(podName, namespace);

  const reason = podDetailsResponse.body.status.containerStatuses.map((containerStatuses) => {
    if (containerStatuses.state && containerStatuses.state.waiting) {
      return containerStatuses.state.waiting.reason;
    } else {
      return null;
    }
  }).filter((item) => item !== null).join(', ');

  return `*PodName:* ${podName}\n*Namespace:* ${namespace}\n*Phase:* ${pod.status.phase}\n*Reason:* \`${reason}\`\n\n`;
}));
process.on('SIGTERM', () => {
  clearInterval(intervalId);
  process.exit();
});

export default router;
