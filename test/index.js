const k8s = require('@kubernetes/client-node');

// Load the kubeconfig file
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Create a Kubernetes API instance
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// List pods in the default namespace
k8sApi.listNamespacedPod('default').then((response) => {
  const pods = response.body.items;

  // Print pod information
  pods.forEach((pod) => {
    console.log(`Name: ${pod.metadata.name}`);
    console.log(`Status: ${pod.status.phase}`);
    console.log('---');
  });
}).catch((err) => {
  console.log('Error:', err);
});
