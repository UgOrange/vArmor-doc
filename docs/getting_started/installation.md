---
sidebar_position: 1
---
# Installation

Understand how to install, configure, upgrade and uninstall vArmor.

## Install vArmor using Helm

vArmor can be deployed via a Helm chart which is the recommended and preferred method for a production install.

In order to install vArmor with Helm, first fetch the chart.

```
helm pull oci://elkeid-ap-southeast-1.cr.volces.com/varmor/varmor --version 0.5.11
```

Then install it with helm optional configurations.

```
helm install varmor varmor-0.5.11.tgz \
    --namespace varmor --create-namespace \
    --set image.registry="elkeid-ap-southeast-1.cr.volces.com"
```

You can use the domain `elkeid-cn-beijing.cr.volces.com` inside of the CN region.


## Configuring vArmor

vArmor allows you to configure its functionality during installation using the helm command.

| Helm Options | Description |
|--------------|-------------|
| `--set appArmorLsmEnforcer.enabled=false` | Default: enabled. The AppArmor enforcer can be disabled with it when the system does not support AppArmor LSM.
| `--set bpfLsmEnforcer.enabled=true` | Default: disabled. The BPF enforcer can be enabled when the system supports BPF LSM.
| `--set bpfExclusiveMode.enabled=true` | Default: disabled. When enabled, AppArmor protection for the target workload will be disabled when a VarmorPolicy object uses the BPF enforcer.
| `--set restartExistWorkloads.enabled=false` | Default: enabled. When disabled, vArmor will prevent users from performing a rolling restart of target existing workloads with the `.spec.updateExistingWorkloads` field of VarmorPolicy/VarmorClusterPolicy. 
| `--set unloadAllAaProfiles.enabled=true` | Default: disabled. When enabled, all AppArmor profiles loaded by vArmor will be unloaded when the Agent exits.
| `--set removeAllSeccompProfiles.enabled=true` | Default: disabled. When enabled, all Seccomp profiles created by vArmor will be unloaded when the Agent exits.
| `--set "manager.args={--webhookMatchLabel=KEY=VALUE}"` | The default value is: `sandbox.varmor.org/enable=true`. vArmor will only enable sandbox protection for Workloads that contain this label. You can disable this feature by using `--set 'manager.args={--webhookMatchLabel=}'`.
| `--set behaviorModeling.enabled=true` | Default: disabled. Experimental feature. Currently, only the AppArmor/Seccomp enforcer supports the BehaviorModeling mode. Please refer to the [BehaviorModeling Mode](behavior_modeling.md) for more details.

## Upgrading vArmor

## Uninstalling vArmor

vArmor can be uninstalled via helm command.

```
helm uninstall varmor -n varmor
```

If you are using the AppArmor & Seccomp enforcer, please follow these steps to uninstall vArmor:
* Filter out all VarmorPolicy/VarmorClusterPolicy objects using the AppArmor or Seccomp enforcer (`.spec.policy.enforcer` contains AppArmor or Seccomp)
* Process each VarmorPolicy/VarmorClusterPolicy and its corresponding workloads one by one.
  * Delete the VarmorPolicy/VarmorClusterPolicy object
  * When the workloads' type is Deployment, StatefulSet, or DaemonSet,
    * If you have enabled `--restartExistWorkloads`, you don't need to perform any additional steps.
    * If `--restartExistWorkloads` is not enabled, you will need to manually remove the annotations and seccompProfiles added by vArmor from the corresponding workloads.
  * When the workloads' type is Pod, you will need to recreate the Pod (make sure there are no annotations and seccompProfiles added by vArmor in the Pod).
* Uninstall vArmor using Helm.
