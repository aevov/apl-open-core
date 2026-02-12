/**
 * APL Package Manager (apl-pkg)
 * Manage APL libraries and dependencies
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

class APLPackageManager {
    constructor(options = {}) {
        this.options = {
            registry: options.registry || 'https://registry.apl.aevov.ai',
            cacheDir: options.cacheDir || path.join(process.cwd(), '.apl_cache'),
            globalDir: options.globalDir || path.join(require('os').homedir(), '.apl', 'packages'),
            ...options
        };
        
        this.packageCache = new Map();
        this.installed = new Map();
        
        this.ensureDirectories();
    }
    
    /**
     * Ensure cache and global directories exist
     */
    ensureDirectories() {
        [this.options.cacheDir, this.options.globalDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    
    /**
     * Install a package
     */
    async install(packageName, version = 'latest', options = {}) {
        console.log(`📦 Installing ${packageName}@${version}...`);
        
        try {
            // Check if already installed
            if (this.isInstalled(packageName, version) && !options.force) {
                console.log(`✓ ${packageName}@${version} already installed`);
                return { success: true, cached: true };
            }
            
            // Fetch package metadata
            const metadata = await this.fetchPackageMetadata(packageName);
            
            if (!metadata) {
                throw new Error(`Package ${packageName} not found`);
            }
            
            // Resolve version
            const resolvedVersion = this.resolveVersion(metadata, version);
            const packageInfo = metadata.versions[resolvedVersion];
            
            if (!packageInfo) {
                throw new Error(`Version ${version} not found for ${packageName}`);
            }
            
            // Download package
            const packagePath = await this.downloadPackage(packageName, resolvedVersion, packageInfo.tarball);
            
            // Extract and install
            await this.extractPackage(packagePath, packageName, resolvedVersion);
            
            // Install dependencies
            if (packageInfo.dependencies && !options.noDependencies) {
                await this.installDependencies(packageInfo.dependencies);
            }
            
            // Register installation
            this.installed.set(packageName, {
                version: resolvedVersion,
                path: this.getPackagePath(packageName, resolvedVersion)
            });
            
            console.log(`✓ ${packageName}@${resolvedVersion} installed successfully`);
            
            return {
                success: true,
                package: packageName,
                version: resolvedVersion
            };
            
        } catch (error) {
            console.error(`✗ Failed to install ${packageName}: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Uninstall a package
     */
    async uninstall(packageName) {
        console.log(`🗑️  Uninstalling ${packageName}...`);
        
        try {
            const info = this.installed.get(packageName);
            if (!info) {
                throw new Error(`Package ${packageName} is not installed`);
            }
            
            // Remove package directory
            const packageDir = info.path;
            if (fs.existsSync(packageDir)) {
                fs.rmSync(packageDir, { recursive: true, force: true });
            }
            
            // Unregister
            this.installed.delete(packageName);
            
            console.log(`✓ ${packageName} uninstalled`);
            
            return { success: true };
            
        } catch (error) {
            console.error(`✗ Failed to uninstall ${packageName}: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * List installed packages
     */
    list() {
        console.log('\n📦 Installed APL Packages:\n');
        
        if (this.installed.size === 0) {
            console.log('  No packages installed');
            return [];
        }
        
        const packages = [];
        
        for (const [name, info] of this.installed.entries()) {
            console.log(`  ${name}@${info.version}`);
            packages.push({ name, version: info.version, path: info.path });
        }
        
        return packages;
    }
    
    /**
     * Search for packages
     */
    async search(query) {
        console.log(`🔍 Searching for "${query}"...`);
        
        try {
            const results = await this.fetchSearchResults(query);
            
            console.log(`\nFound ${results.length} results:\n`);
            
            results.forEach(pkg => {
                console.log(`  ${pkg.name}@${pkg.version}`);
                console.log(`    ${pkg.description}`);
                console.log('');
            });
            
            return results;
            
        } catch (error) {
            console.error(`✗ Search failed: ${error.message}`);
            return [];
        }
    }
    
    /**
     * Update a package
     */
    async update(packageName) {
        console.log(`⬆️  Updating ${packageName}...`);
        
        try {
            const metadata = await this.fetchPackageMetadata(packageName);
            const latest = metadata['dist-tags'].latest;
            
            const result = await this.install(packageName, latest, { force: true });
            
            if (result.success) {
                console.log(`✓ ${packageName} updated to ${latest}`);
            }
            
            return result;
            
        } catch (error) {
            console.error(`✗ Update failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Publish a package
     */
    async publish(packageDir = process.cwd()) {
        console.log('📤 Publishing package...');
        
        try {
            // Read package.json
            const packageJsonPath = path.join(packageDir, 'package.json');
            if (!fs.existsSync(packageJsonPath)) {
                throw new Error('No package.json found');
            }
            
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            
            // Validate package
            this.validatePackage(packageJson);
            
            // Create tarball
            const tarball = await this.createTarball(packageDir);
            
            // Upload to registry
            const result = await this.uploadPackage(packageJson, tarball);
            
            console.log(`✓ ${packageJson.name}@${packageJson.version} published`);
            
            return result;
            
        } catch (error) {
            console.error(`✗ Publish failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Initialize a new package
     */
    async init(dir = process.cwd()) {
        console.log('📝 Initializing new APL package...');
        
        const packageJson = {
            name: path.basename(dir),
            version: '1.0.0',
            description: 'An APL package',
            main: 'index.apl',
            scripts: {},
            keywords: ['apl'],
            author: '',
            license: 'Apache-2.0'
        };
        
        const packageJsonPath = path.join(dir, 'package.json');
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
        // Create example file
        const exampleCode = `// APL Package
// Generated by apl-pkg

function greet(name) {
    print("Hello, " + name + "!")
}

greet("World")
`;
        
        fs.writeFileSync(path.join(dir, 'index.apl'), exampleCode);
        
        console.log('✓ Package initialized');
        console.log(`  Created: package.json`);
        console.log(`  Created: index.apl`);
        
        return { success: true };
    }
    
    // Helper methods
    
    async fetchPackageMetadata(packageName) {
        return new Promise((resolve, reject) => {
            const url = `${this.options.registry}/${packageName}`;
            
            https.get(url, (res) => {
                let data = '';
                
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Invalid package metadata'));
                    }
                });
            }).on('error', reject);
        });
    }
    
    async fetchSearchResults(query) {
        // Simulate search for now
        return [
            {
                name: 'apl-quantum-utils',
                version: '1.0.0',
                description: 'Quantum computing utilities for APL'
            },
            {
                name: 'apl-neural-networks',
                version: '2.1.0',
                description: 'Neural network library for APL'
            }
        ].filter(pkg => pkg.name.includes(query) || pkg.description.includes(query));
    }
    
    resolveVersion(metadata, version) {
        if (version === 'latest') {
            return metadata['dist-tags'].latest;
        }
        return version;
    }
    
    async downloadPackage(name, version, tarballUrl) {
        const filename = `${name}-${version}.tgz`;
        const filepath = path.join(this.options.cacheDir, filename);
        
        if (fs.existsSync(filepath)) {
            return filepath;
        }
        
        // Download tarball
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(filepath);
            
            https.get(tarballUrl, (res) => {
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filepath);
                });
            }).on('error', (err) => {
                fs.unlinkSync(filepath);
                reject(err);
            });
        });
    }
    
    async extractPackage(tarballPath, name, version) {
        const extractPath = this.getPackagePath(name, version);
        
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath, { recursive: true });
        }
        
        // Extract using tar
        try {
            execSync(`tar -xzf ${tarballPath} -C ${extractPath} --strip-components=1`);
        } catch (error) {
            throw new Error(`Failed to extract package: ${error.message}`);
        }
    }
    
    async installDependencies(dependencies) {
        for (const [name, version] of Object.entries(dependencies)) {
            await this.install(name, version);
        }
    }
    
    getPackagePath(name, version) {
        return path.join(this.options.globalDir, name, version);
    }
    
    isInstalled(name, version) {
        const info = this.installed.get(name);
        return info && (version === 'latest' || info.version === version);
    }
    
    validatePackage(packageJson) {
        const required = ['name', 'version'];
        
        for (const field of required) {
            if (!packageJson[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Validate name
        if (!/^[a-z0-9-]+$/.test(packageJson.name)) {
            throw new Error('Invalid package name (use lowercase letters, numbers, and hyphens only)');
        }
    }
    
    async createTarball(packageDir) {
        const tarballPath = path.join(this.options.cacheDir, 'temp.tgz');
        
        try {
            execSync(`tar -czf ${tarballPath} -C ${packageDir} .`);
            return tarballPath;
        } catch (error) {
            throw new Error(`Failed to create tarball: ${error.message}`);
        }
    }
    
    async uploadPackage(packageJson, tarballPath) {
        // In production, upload to registry
        console.log('  Uploading to registry...');
        
        // Simulate upload
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }
}

// CLI interface
if (require.main === module) {
    const [,, command, ...args] = process.argv;
    const pm = new APLPackageManager();
    
    switch (command) {
        case 'install':
            pm.install(args[0], args[1]);
            break;
        case 'uninstall':
            pm.uninstall(args[0]);
            break;
        case 'list':
            pm.list();
            break;
        case 'search':
            pm.search(args[0]);
            break;
        case 'update':
            pm.update(args[0]);
            break;
        case 'publish':
            pm.publish(args[0]);
            break;
        case 'init':
            pm.init(args[0]);
            break;
        default:
            console.log(`
APL Package Manager v1.0.0

Usage:
  apl-pkg install <package> [version]
  apl-pkg uninstall <package>
  apl-pkg list
  apl-pkg search <query>
  apl-pkg update <package>
  apl-pkg publish [dir]
  apl-pkg init [dir]
            `);
    }
}

module.exports = APLPackageManager;
