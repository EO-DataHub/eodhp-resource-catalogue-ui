.PHONY: dockerbuild dockerpush test testonce ruff black lint isort pre-commit-check requirements-update requirements setup
VERSION ?= latest
IMAGENAME = eodhp-resource-catalogue-ui
DOCKERREPO ?= public.ecr.aws/n1b3o1k2/ukeodhp

# dockerbuild:
# 	DOCKER_BUILDKIT=1 docker build -t ${IMAGENAME}:${VERSION} .
#
# dockerpush: dockerbuild testdocker
# 	docker tag ${IMAGENAME}:${VERSION} ${DOCKERREPO}/${IMAGENAME}:${VERSION}
# 	docker push ${DOCKERREPO}/${IMAGENAME}:${VERSION}

# test:
# 	./venv/bin/ptw configscanning
#
# testonce:
# 	./venv/bin/pytest

# lint:
#     npm run lint

husky:
	npm install husky --save-dev
	npx husky install
	npm install stylelint stylelint-config-standard --save-dev

.git/hooks/pre-commit:
	npx husky init .husky/pre-commit "npm run lint"
	curl -o .pre-commit-config.yaml https://raw.githubusercontent.com/EO-DataHub/github-actions/main/.pre-commit-config-node.yaml
	curl -o .stylelintrc.json https://raw.githubusercontent.com/EO-DataHub/github-actions/main/.stylelintrc.json

setup: husky .git/hooks/pre-commit
