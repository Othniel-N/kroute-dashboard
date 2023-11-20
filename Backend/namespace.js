// services.js
import express from 'express';
import * as k8s from '@kubernetes/client-node';

const router = express.Router();

router.get('/totalpods', async (req, res) => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const response = await k8sApi.listNamespace();

    const namespaceNames = response.body.items.map((namespace) => namespace.metadata.name);

    // Fetch the number of pods for each namespace
    let totalPodCount = 0;
    for (const namespaceName of namespaceNames) {
      const podResponse = await k8sApi.listNamespacedPod(namespaceName);
      totalPodCount += podResponse.body.items.length;
    }

    res.json([{ "seeing": "podincluster", "totalcount": totalPodCount }]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/pendingpods', async (req, res) => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const response = await k8sApi.listPodForAllNamespaces();

    // Count pods whose status is not running
    const notRunningPodCount = response.body.items.reduce((count, pod) => {
      const phase = pod.status.phase.toLowerCase();
      if (phase !== 'running') {
        count++;
      }
      return count;
    }, 0);

    res.json([{ "seeing": "podnotrunning", "totalcount": notRunningPodCount }]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/totalnamespaces', async (req, res) => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const response = await k8sApi.listNamespace();

    const namespaceCount = response.body.items.length;

    res.json([{ "seeing": "namespacecount", "totalcount": namespaceCount }]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/service', async (req, res) => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const appsApi = kc.makeApiClient(k8s.AppsV1Api);

    const responseServices = await k8sApi.listServiceForAllNamespaces();
    const responseReplicas = await appsApi.listReplicaSetForAllNamespaces()
    const responseDeployments = await appsApi.listDeploymentForAllNamespaces();
    const responseStatefulSets = await appsApi.listStatefulSetForAllNamespaces();
    const responseNodes = await k8sApi.listNode();

    // Count of each service type
    let clusterIPCount = 0;
    let nodePortCount = 0;
    let loadBalancerCount = 0;

    // Count of deployments and statefulsets
    const deploymentCount = responseDeployments.body.items.length;
    const statefulSetCount = responseStatefulSets.body.items.length;
    const replicaSetCount = responseReplicas.body.items.length;
    const nodeCount = responseNodes.body.items.length;

    responseServices.body.items.forEach((service) => {
      const serviceType = service.spec.type;

      if (serviceType === 'ClusterIP') {
        clusterIPCount++;
      } else if (serviceType === 'NodePort') {
        nodePortCount++;
      } else if (serviceType === 'LoadBalancer') {
        loadBalancerCount++;
      }
    });

    res.json([
      {
        "clusterIPCount": clusterIPCount,
        "nodePortCount": nodePortCount,
        "loadBalancerCount": loadBalancerCount,
        "deploymentCount": deploymentCount,
        "statefulSetCount": statefulSetCount,
        "replicaSetCount": replicaSetCount,
        "totalnodes": nodeCount
      }
    ]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/namespace-pod-count', async (req, res) => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const responseNamespaces = await k8sApi.listNamespace();
    const responsePods = await k8sApi.listPodForAllNamespaces();

    // Create a map to store the count of pods in each namespace
    const podCountMap = {};

    // Initialize the map with 0 for each namespace
    responseNamespaces.body.items.forEach((namespace) => {
      const namespaceName = namespace.metadata.name;
      podCountMap[namespaceName] = 0;
    });

    // Count the pods in each namespace
    responsePods.body.items.forEach((pod) => {
      const namespaceName = pod.metadata.namespace;
      podCountMap[namespaceName]++;
    });

    // Convert the map to an array of objects
    const result = Object.entries(podCountMap).map(([namespace, podCount]) => ({
      [namespace]: podCount,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



export default router;
