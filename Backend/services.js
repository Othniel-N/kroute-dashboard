// services.js
import express from 'express';
import * as k8s from '@kubernetes/client-node';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const kc = new k8s.KubeConfig();
      kc.loadFromDefault();
  
      const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
      const response = await k8sApi.listServiceForAllNamespaces();
  
      const services = response.body.items
      .filter((service) => service.spec.type === 'LoadBalancer')
      .map((service) => ({
        Namespace: service.metadata.namespace,
        Name: service.metadata.name,
        IP: service.status.loadBalancer.ingress,
        Port: service.spec.ports.map((port)=>({
            port: port.port
        }))
      }));
  
      res.json(services);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/ppods', async (req, res) => {
    try {
      const kc = new k8s.KubeConfig();
      kc.loadFromDefault();
  
      const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  
      const response = await k8sApi.listPodForAllNamespaces();
  
      // Filter pods that are in the 'Pending' or 'Unknown' phase
      const pendingPods = response.body.items.filter((pod) => !pod.status.phase || pod.status.phase === 'Pending' || pod.status.phase === 'Unknown');
  
      // Extract relevant information for each pending pod
      const pendingPodInfo = await Promise.all(pendingPods.map(async (pod) => {
        const podName = pod.metadata.name;
        const namespace = pod.metadata.namespace;
  
        try {
          // Retrieve detailed information for the pending pod
          const podDetailsResponse = await k8sApi.readNamespacedPod(podName, namespace);
  
          const podDetails = {
            podName,
            namespace,
            events: (podDetailsResponse.body.status.containerStatuses || []).map((containerStatus) => ({
              Reason: {
                message: containerStatus.state.waiting ? containerStatus.state.waiting.reason : 'N/A',
                reason: 'N/A', // You may need to adjust this based on your data structure
              },
            })),
            // Add other relevant details as needed
          };
  
          return podDetails;
        } catch (error) {
          console.error(`Error fetching details for pod ${podName} in namespace ${namespace}:`, error);
          return {
            podName,
            namespace,
            events: [{ Reason: 'Error fetching details' }],
            // Add other relevant details as needed
          };
        }
      }));
  
      res.json({ pendingPods: pendingPodInfo });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
  

  router.get('/running-pods-not-ready', async (req, res) => {
    try {
      const kc = new k8s.KubeConfig();
      kc.loadFromDefault();
  
      const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  
      const response = await k8sApi.listPodForAllNamespaces();
  
      // Filter pods that are in the 'Running' phase but container status is not ready
      const runningPodsNotReady = response.body.items.filter((pod) =>
        pod.status.phase === 'Running' && pod.status.containerStatuses.every((containerStatus) => !containerStatus.ready)
      );
  
      // Extract relevant information for each pod
      const podInfo = await Promise.all(
        runningPodsNotReady.map(async (pod) => {
          const podName = pod.metadata.name;
          const namespace = pod.metadata.namespace;
  
          try {
            // Retrieve detailed information for the pod
            const podDetailsResponse = await k8sApi.readNamespacedPod(podName, namespace);
  
            const podDetails = {
              podName,
              namespace,
              events: (podDetailsResponse.body.status.containerStatuses || []).map((containerStatus) => ({
                Reason: {
                  message: containerStatus.state.waiting ? containerStatus.state.waiting.reason : 'N/A',
                  reason: 'N/A', // You may need to adjust this based on your data structure
                },
              })),
              // Add other relevant details as needed
            };
  
            return podDetails;
          } catch (error) {
            console.error(`Error fetching details for pod ${podName} in namespace ${namespace}:`, error);
            return {
              podName,
              namespace,
              events: [{ Reason: 'Error fetching details' }],
              // Add other relevant details as needed
            };
          }
        })
      );
  
      res.json({ runningPodsNotReady: podInfo });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
  
  
  export default router;
