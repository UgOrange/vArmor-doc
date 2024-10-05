---
sidebar_position: 4
description: How to write policies to meet the needs of different scenarios.
---

# Writing Policies
You can refer to the [examples](https://github.com/bytedance/vArmor/tree/main/test/demo) to understand how to use the relevant features and write policies. You can also try using [policy-advisor](../policy_advisor) to generate a policy template, and then build the final policy based on it.

## Example 1
The following policy enables sandbox with EnhanceProtect mode for deployments in the default namespace (with `sandbox.varmor.org/enable="true"` and `app=nginx` labels, and an `environment` label value of `dev` or `qa`). The sandbox rules used are as follows:

- Disable all privileged capabilities (those that can lead to escapes)
- Disable CAP_NET_RAW capability (Prohibit the use of the AF_PACKET protocol family to create sockets, preventing the construction of link-layer packets and activities like network sniffing.)
- Prohibit writing to the /etc directory
- Prohibit shell and its subprocesses from accessing the container's ServiceAccount information

```
apiVersion: crd.varmor.org/v1beta1
kind: VarmorPolicy
metadata:
  name: deployment-policy
  namespace: default
spec:
  target:
    kind: Deployment
    selector:
      matchLabels:
        app: nginx
      matchExpressions:
      - key: environment
        operator: In
        values: [dev, qa]
  policy:
    enforcer: AppArmor
    mode: EnhanceProtect
    enhanceProtect:
      hardeningRules:
      - disable_cap_privileged
      - disable_cap_net_raw
      attackProtectionRules:
      - rules: 
        - disable-write-etc
      - rules:
        - mitigate-sa-leak
        targets:
        - "/bin/sh"
        - "/usr/bin/sh"
        - "/bin/dash"
        - "/usr/bin/dash"
        - "/bin/bash"
        - "/usr/bin/bash"
        - "/bin/busybox"
        - "/usr/bin/busybox"
```
## Example 2
The following policy enables sandbox with EnhanceProtect mode for pods in the test namespace (with `sandbox.varmor.org/enable="true"` and `app=custom-controller-pod` labels). The sandbox rules used are as follows:
- Disable all privileged capabilities
- Disable CAP_NET_RAW capability
- Prohibit writing to the /etc directory
- Prohibit shell and its subprocesses from accessing the container's ServiceAccount information
```
apiVersion: crd.varmor.org/v1beta1
kind: VarmorPolicy
metadata:
  name: pod-policy
  namespace: test
spec:
  target:
    kind: Pod
    selector:
      matchLabels:
        app: custom-controller-pod
  policy:
    enforcer: AppArmor
    mode: EnhanceProtect
    enhanceProtect:
      hardeningRules:
      - disable_cap_privileged
      - disable_cap_net_raw
      attackProtectionRules:
      - rules: 
        - disable-write-etc
        - mitigate-host-ip-leak
      - rules:
        - mitigate-sa-leak
        targets:
        - "/bin/sh"
        - "/usr/bin/sh"
        - "/bin/dash"
        - "/usr/bin/dash"
        - "/bin/bash"
        - "/usr/bin/bash"
        - "/bin/busybox"
        - "/usr/bin/busybox"
```
