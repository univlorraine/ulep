apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: "{{ .Values.name }}"
spec:
  dnsNames:
    - "{{ .Values.url }}.{{ .Values.domain }}"
  issuerRef:
    name: "{{ .Values.issuerName }}"
    kind: ClusterIssuer
  secretName: "{{ .Values.name }}-tls"
